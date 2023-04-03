const { spawn } = require('child_process');

function runBuildCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.  Check logs above for failure.`));
        return;
      }
      resolve();
    });
  });
}

async function main() {
  try {
    await runBuildCommand('yarn', ['workspaces', 'foreach', '--topological-dev', '-pv', 'run', 'build']);
    console.log('Build successful');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
