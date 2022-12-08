import * as path from 'path';
import { projectPaths, WorkspaceContextUtil, workspaceUtils } from '../../../src/';
import { TOOLS } from '../../../src/helpers/paths';

jest.mock('@salesforce/core', () => {
  return {
    Global: {
      SFDX_STATE_FOLDER: '.sfdx',
      STATE_FOLDER: '.sfdx'
    }
  };
});

describe('test project paths', () => {
  const hasRootWorkspaceStub = jest.spyOn(workspaceUtils, 'hasRootWorkspace');
  const FAKE_WORKSPACE = '/here/is/a/fake/path/to/';
  const FAKE_STATE_FOLDER = '.sfdx';
  const FAKE_CONFIG_FILE = 'sfdx-config.json';
  const FAKE_USERNAME = 'testuser';
  const FAKE_METADATA = 'metadata';
  const FAKE_ORGS = 'orgs';
  const FAKE_PATH_TO_STATE_FOLDER = path.join(FAKE_WORKSPACE, FAKE_STATE_FOLDER);
  const FAKE_PATH_TO_METADATA_FOLDER = path.join(FAKE_PATH_TO_STATE_FOLDER, FAKE_ORGS, FAKE_USERNAME, FAKE_METADATA);

  describe('test stateFolder', () => {
    let getRootWorkspacePathStub: jest.SpyInstance;

    beforeEach(() => {
      getRootWorkspacePathStub = jest
        .spyOn(workspaceUtils, 'getRootWorkspacePath')
        .mockReturnValue(FAKE_WORKSPACE);
    });

    it('should return a path to the state folder if the project has a root workspace', () => {
      hasRootWorkspaceStub.mockReturnValue(true);
      expect(projectPaths.stateFolder()).toEqual(FAKE_PATH_TO_STATE_FOLDER);
    });

    it('should return a path to the state folder if the project does not have a root workspace', () => {
      hasRootWorkspaceStub.mockReturnValue(false);
      expect(projectPaths.stateFolder()).toEqual('');
    });
  });
  describe('test sfdxProjectConfig', () => {
    let stateFolderStub: jest.SpyInstance;
    const FAKE_CONFIG = path.join(FAKE_WORKSPACE, FAKE_CONFIG_FILE);

    beforeEach(() => {
      stateFolderStub = jest
        .spyOn(projectPaths, 'stateFolder')
        .mockReturnValue(FAKE_WORKSPACE);
    });

    it('should be defined', () => {
      expect(projectPaths.sfdxProjectConfig).toBeDefined();
    });

    it('should return a path to the config file based on root workspace', () => {
      const sfdxProjectConfig = projectPaths.sfdxProjectConfig();
      expect(sfdxProjectConfig).toEqual(FAKE_CONFIG);
    });
  });

  describe('test relativeStateFolder', () => {
    it('should be defined', () => {
      expect(projectPaths.relativeStateFolder).toBeDefined();
    });

    it('should return a path to the relative state folder', () => {
      const relativeStateFolder = projectPaths.relativeStateFolder();
      expect(relativeStateFolder).toEqual(FAKE_STATE_FOLDER);
    });
  });

  describe('test relativeToolsFolder', () => {
    it('should be defined', () => {
      expect(projectPaths.relativeToolsFolder).toBeDefined();
    });

    it('should return a path to the relative tools folder', () => {
      const relativeToolsFolder = projectPaths.relativeToolsFolder();
      expect(relativeToolsFolder).toEqual(path.join(FAKE_STATE_FOLDER, TOOLS));
    });
  });

  describe('test metadataFolder', () => {
    let usernameStub: jest.SpyInstance;
    let workspaceContextUtil: any;

    beforeEach(() => {
      workspaceContextUtil = WorkspaceContextUtil.getInstance(true);
      usernameStub = jest
      .spyOn(workspaceContextUtil.prototype, 'username')
      .mockReturnValue(FAKE_USERNAME)
    });


    it('should return a path to the metadata folder if the username is passed', () => {
      hasRootWorkspaceStub.mockReturnValue(true);
      expect(projectPaths.metadataFolder(FAKE_USERNAME)).toEqual(FAKE_PATH_TO_METADATA_FOLDER);
    });

    it('should return a path to the metadata folder if the username is not passed', () => {
      expect(projectPaths.metadataFolder()).toEqual(FAKE_PATH_TO_METADATA_FOLDER);
    });
  });
});
