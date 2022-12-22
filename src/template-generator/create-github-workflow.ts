import InitOptions from '../options/init-options';
import * as fs from 'fs';
import path from 'path';

const TEMPLATE = 'name: Tests\n' +
    '\n' +
    'on:\n' +
    '  push:\n' +
    '    branches: [ main ]\n' +
    '  pull_request:\n' +
    '    branches: [ main ]\n' +
    '\n' +
    'jobs:\n' +
    '  test:\n' +
    '    runs-on: ubuntu-latest\n' +
    '    steps:\n' +
    '      - uses: actions/checkout@v3\n' +
    '\n' +
    '      - name: Use Node.js ${{ matrix.node-version }}\n' +
    '        uses: actions/setup-node@v3\n' +
    '        with:\n' +
    '          node-version: ${{ matrix.node-version }}\n' +
    '\n' +
    '      - name: Tests\n' +
    '        run: |\n' +
    '          npm install\n' +
    '          npm run ${testScriptName}\n';

const WORKFLOW_PATH = './.github/workflows';

function getFreeName (): string {
    return 'testcafe.yml';
}

export function createGithubWorkflow ({ testScriptName, rootPath }: InitOptions): void {
    const content          = TEMPLATE.replace('${testScriptName}', testScriptName);
    const fileName         = getFreeName();
    const workflowFullPath = path.join(rootPath, WORKFLOW_PATH);

    if (!fs.existsSync(workflowFullPath))
        fs.mkdirSync(workflowFullPath, { recursive: true });

    return fs.writeFileSync(path.join(rootPath, WORKFLOW_PATH, fileName), content);
}
