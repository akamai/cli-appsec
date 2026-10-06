let WafRuleset = require('../../src/wafruleset').wafRuleset;
let out = require('./lib/out');
const Table = require('easy-table');
const chalk = require('chalk');

// Force color support
chalk.level = 3;

class WafRulesetCommand {
  constructor() {
    this.flags = 'waf-ruleset';
    this.desc = 'Display WAF ruleset information including attack groups and rules.';
    this.setup = this.setup.bind(this);
    this.run = this.run.bind(this);
  }

  setup(sywac) {
    sywac
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
      });
  }

  run(options) {
    out.print({
      promise: new WafRuleset(options).getWafRuleset(),
      args: options,
      success: (args, data) => {
        if (args.json) {
          return data;
        }

        if (!data) {
          return 'No data returned';
        }

        let output = [];

        // Header
        output.push(chalk.bold.cyan('\n═══════════════════════════════════════════'));
        output.push(chalk.bold.cyan('         WAF RULESET INFORMATION'));
        output.push(chalk.bold.cyan('═══════════════════════════════════════════'));

        if (data.ruleSetInfo) {
          output.push(
            chalk.white(`\nRuleset Version: ${chalk.bold.yellow(data.ruleSetInfo.rulesetVersion)}`)
          );
        }

        if (data.adaptiveIntelligence) {
          const threatIntelStatus = data.adaptiveIntelligence.threatIntelEnabled;
          const statusText = threatIntelStatus ? chalk.green('✓ Enabled') : chalk.red('✗ Disabled');
          output.push(chalk.white(`Threat Intel: ${statusText}\n`));
        }

        // Attack Groups Table
        if (data.attackGroups && data.attackGroups.length > 0) {
          output.push(chalk.bold.blue(`\n▸ Attack Groups (${data.attackGroups.length}):`));
          let attackGroupsTable = new Table();
          data.attackGroups.forEach(ag => {
            attackGroupsTable.cell('Group', chalk.cyan(ag.group));

            // Color code actions
            let actionColor;
            switch (ag.action.toLowerCase()) {
              case 'deny':
                actionColor = chalk.red;
                break;
              case 'alert':
                actionColor = chalk.yellow;
                break;
              case 'none':
                actionColor = chalk.gray;
                break;
              default:
                actionColor = chalk.white;
            }
            attackGroupsTable.cell('Action', actionColor(ag.action.toUpperCase()));

            const hasException = Object.keys(ag.conditionException || {}).length > 0;
            attackGroupsTable.cell(
              'Exception',
              hasException ? chalk.yellow('Yes') : chalk.gray('No')
            );
            attackGroupsTable.newRow();
          });
          output.push(attackGroupsTable.toString());
        }

        // Rules Summary and Sample
        if (data.rules && data.rules.length > 0) {
          output.push(chalk.bold.blue(`\n▸ Rules (${chalk.bold.white(data.rules.length)} total):`));

          // Count by action
          const actionCounts = {};
          const exceptionCount = data.rules.filter(
            r => Object.keys(r.conditionException || {}).length > 0
          ).length;
          data.rules.forEach(r => {
            actionCounts[r.action] = (actionCounts[r.action] || 0) + 1;
          });

          output.push(chalk.white('\nSummary:'));
          Object.keys(actionCounts).forEach(action => {
            let color;
            switch (action.toLowerCase()) {
              case 'deny':
                color = chalk.red;
                break;
              case 'alert':
                color = chalk.yellow;
                break;
              case 'none':
                color = chalk.gray;
                break;
              default:
                color = chalk.white;
            }
            output.push(
              `  ${color(action.toUpperCase())}: ${chalk.bold(actionCounts[action])} rules`
            );
          });
          output.push(`  ${chalk.yellow('Rules with exceptions')}: ${chalk.bold(exceptionCount)}`);

          // Show first 10 rules
          output.push(chalk.white('\nFirst 10 Rules:'));
          let rulesTable = new Table();
          data.rules.slice(0, 10).forEach(rule => {
            rulesTable.cell('Rule ID', chalk.cyan(rule.ruleId || rule.id));

            // Color code actions
            let actionColor;
            switch (rule.action.toLowerCase()) {
              case 'deny':
                actionColor = chalk.red;
                break;
              case 'alert':
                actionColor = chalk.yellow;
                break;
              case 'none':
                actionColor = chalk.gray;
                break;
              default:
                actionColor = chalk.white;
            }
            rulesTable.cell('Action', actionColor(rule.action.toUpperCase()));

            rulesTable.cell(
              'Name',
              chalk.white(rule.ruleName.substring(0, 60) + (rule.ruleName.length > 60 ? '...' : ''))
            );

            const hasException = Object.keys(rule.conditionException || {}).length > 0;
            rulesTable.cell('Exception', hasException ? chalk.yellow('Yes') : chalk.gray('No'));
            rulesTable.newRow();
          });
          output.push(rulesTable.toString());
          output.push(
            chalk.dim(
              `\n💡 Tip: Use ${chalk.bold('--json')} flag to see all ${data.rules.length} rules`
            )
          );
        }

        output.push(chalk.bold.cyan('\n═══════════════════════════════════════════\n'));

        return output.join('\n');
      }
    });
  }
}

module.exports = new WafRulesetCommand();
