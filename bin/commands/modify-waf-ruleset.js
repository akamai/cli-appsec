let WafRuleset = require('../../src/wafruleset').wafRuleset;
let out = require('./lib/out');
const Table = require('easy-table');
const chalk = require('chalk');

// Force color support
chalk.level = 3;

class ModifyWafRulesetCommand {
  constructor() {
    this.flags = 'modify-waf-ruleset';
    this.desc = 'Update WAF ruleset by patching attack groups and/or rules.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
      .positional('<@path>', {
        paramsDesc: 'The input file path containing attack groups and/or rules to update.'
      })
      .number('--config <id>', {
        desc: 'Configuration ID. Mandatory if you have more than one configuration.',
        group: 'Optional:',
        required: false
      })
      .string('--version <id>', {
        desc:
          "Version Number. It can also take the values 'PROD' or 'PRODUCTION' or 'STAGING'. If not provided, latest version is assumed.",
        group: 'Optional:',
        required: false
      })
      .string('--policy <id>', {
        desc:
          'Policy ID. If not provided, we try to use the policy available on file. If you have more than one policy, this option must be provided.',
        group: 'Optional:',
        required: false
      })
      .check((argv, context) => {
        if (!argv['@path'].startsWith('@')) {
          return context.cliMessage("ERROR: Invalid file name, should start with '@'");
        }
      });
  }

  run(options) {
    options.file = options['@path'].replace('@', '');

    out.print({
      promise: new WafRuleset(options).modifyWafRuleset(),
      args: options,
      success: (args, data) => {
        if (args.json) {
          return JSON.stringify(data);
        }

        // Build formatted output
        let output = '\n';
        output += chalk.bold('═'.repeat(43) + '\n');
        output += chalk.bold.green('    WAF RULESET SUCCESSFULLY UPDATED\n');
        output += chalk.bold('═'.repeat(43) + '\n\n');

        // Ruleset info
        if (data.ruleSetInfo) {
          output += chalk.white(
            'Ruleset Version: ' + chalk.cyan(data.ruleSetInfo.rulesetVersion) + '\n'
          );
        }

        // Threat Intel
        if (data.adaptiveIntelligence) {
          const threatIntel = data.adaptiveIntelligence.threatIntelEnabled
            ? chalk.green('✓ Enabled')
            : chalk.red('✗ Disabled');
          output += chalk.white('Threat Intel: ' + threatIntel + '\n\n');
        }

        // Attack Groups
        if (data.attackGroups && data.attackGroups.length > 0) {
          output += chalk.bold.cyan('\n▸ Attack Groups (' + data.attackGroups.length + '):\n');
          const groupTable = new Table();

          data.attackGroups.forEach(group => {
            const actionColor =
              group.action === 'deny'
                ? chalk.red
                : group.action === 'alert'
                ? chalk.yellow
                : chalk.gray;

            const hasException =
              group.conditionException &&
              Object.keys(group.conditionException).length > 0 &&
              group.conditionException.exception;

            groupTable.cell('Group', chalk.white(group.group));
            groupTable.cell('Action', actionColor(group.action.toUpperCase()));
            groupTable.cell('Exception', hasException ? chalk.yellow('Yes') : chalk.gray('No'));
            groupTable.newRow();
          });

          output += groupTable.toString();
        }

        // Rules summary
        if (data.rules && data.rules.length > 0) {
          output += chalk.bold.cyan('\n▸ Rules (' + data.rules.length + ' total):\n\n');

          // Count by action
          const actionCounts = {};
          let rulesWithExceptions = 0;

          data.rules.forEach(rule => {
            actionCounts[rule.action] = (actionCounts[rule.action] || 0) + 1;
            if (rule.conditionException && Object.keys(rule.conditionException).length > 0) {
              rulesWithExceptions++;
            }
          });

          output += chalk.white('Summary:\n');
          if (actionCounts.deny) {
            output += chalk.white('  ' + chalk.red('DENY') + ': ' + actionCounts.deny + ' rules\n');
          }
          if (actionCounts.alert) {
            output += chalk.white(
              '  ' + chalk.yellow('ALERT') + ': ' + actionCounts.alert + ' rules\n'
            );
          }
          if (actionCounts.none) {
            output += chalk.white(
              '  ' + chalk.gray('NONE') + ': ' + actionCounts.none + ' rules\n'
            );
          }
          output += chalk.white(
            '  Rules with exceptions: ' + chalk.cyan(rulesWithExceptions) + '\n'
          );

          // Show first 10 rules
          const displayRules = data.rules.slice(0, 10);
          output += chalk.white('\nFirst 10 Rules:\n');

          const ruleTable = new Table();
          displayRules.forEach(rule => {
            const actionColor =
              rule.action === 'deny'
                ? chalk.red
                : rule.action === 'alert'
                ? chalk.yellow
                : chalk.gray;

            const hasException =
              rule.conditionException && Object.keys(rule.conditionException).length > 0;

            const ruleName =
              rule.ruleName.length > 65 ? rule.ruleName.substring(0, 62) + '...' : rule.ruleName;

            ruleTable.cell('Rule ID', chalk.white(rule.ruleId));
            ruleTable.cell('Action', actionColor(rule.action.toUpperCase()));
            ruleTable.cell('Name', chalk.white(ruleName));
            ruleTable.cell('Exception', hasException ? chalk.yellow('Yes') : chalk.gray('No'));
            ruleTable.newRow();
          });

          output += ruleTable.toString();

          if (data.rules.length > 10) {
            output += chalk.gray(
              '\n\n💡 Tip: Use --json flag to see all ' + data.rules.length + ' rules\n'
            );
          }
        }

        output += chalk.bold('\n' + '═'.repeat(43) + '\n');

        return output;
      }
    });
  }
}

module.exports = new ModifyWafRulesetCommand();
