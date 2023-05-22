/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import * as shell from 'shelljs';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as assert from 'yeoman-assert';

import {
    channelService, notificationService, workspaceUtils
} from '@salesforce/salesforcedx-utils-vscode';
import { TemplateService } from '@salesforce/templates';

import { forceVisualforcePageCreate } from '../../../../src/commands/templates';

// tslint:disable:no-unused-expression
describe('Force Visualforce Page Create', () => {
  let showInputBoxStub: sinon.SinonStub;
  let quickPickStub: sinon.SinonStub;
  let appendLineStub: sinon.SinonStub;
  let showSuccessfulExecutionStub: sinon.SinonStub;
  let showFailedExecutionStub: sinon.SinonStub;
  let openTextDocumentStub: sinon.SinonStub;

  beforeEach(() => {
    showInputBoxStub = sinon.stub(vscode.window, 'showInputBox');
    quickPickStub = sinon.stub(vscode.window, 'showQuickPick');
    appendLineStub = sinon.stub(channelService, 'appendLine');
    showSuccessfulExecutionStub = sinon.stub(
      notificationService,
      'showSuccessfulExecution'
    );
    showSuccessfulExecutionStub.returns(Promise.resolve());
    showFailedExecutionStub = sinon.stub(notificationService, 'showFailedExecution');
    openTextDocumentStub = sinon.stub(vscode.workspace, 'openTextDocument');
  });

  afterEach(() => {
    showInputBoxStub.restore();
    quickPickStub.restore();
    showSuccessfulExecutionStub.restore();
    showFailedExecutionStub.restore();
    appendLineStub.restore();
    openTextDocumentStub.restore();
  });

  it('Should create Visualforce Component', async () => {
    // arrange
    const fileName = 'testVFPage';
    const outputPath = 'force-app/main/default/components';
    const vfPagePath = path.join(
      workspaceUtils.getRootWorkspacePath(),
      outputPath,
      'testVFPage.page'
    );
    const vfPageMetaPath = path.join(
      workspaceUtils.getRootWorkspacePath(),
      outputPath,
      'testVFPage.page-meta.xml'
    );
    shell.rm('-f', path.join(vfPagePath));
    shell.rm('-f', path.join(vfPageMetaPath));
    assert.noFile([vfPagePath, vfPageMetaPath]);
    showInputBoxStub.returns(fileName);
    quickPickStub.returns(outputPath);

    // act
    await forceVisualforcePageCreate();

    // assert
    const defaultApiVersion = TemplateService.getDefaultApiVersion();
    assert.file([vfPagePath, vfPageMetaPath]);
    assert.fileContent(
      vfPagePath,
      `<apex:page>
<!-- Begin Default Content REMOVE THIS -->
<h1>Congratulations</h1>
This is your new Page
<!-- End Default Content REMOVE THIS -->
</apex:page>`
    );
    assert.fileContent(
      vfPageMetaPath,
      `<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata"> \n    <apiVersion>${defaultApiVersion}</apiVersion>
    <label>testVFPage</label>
</ApexPage>`
    );
    sinon.assert.calledOnce(openTextDocumentStub);
    sinon.assert.calledWith(openTextDocumentStub, vfPagePath);

    // clean up
    shell.rm(
      '-rf',
      path.join(workspaceUtils.getRootWorkspacePath(), outputPath)
    );
  });
});
