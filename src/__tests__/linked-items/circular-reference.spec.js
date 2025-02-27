
const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../../gatsby-node');

// Project ID 37286fdf-cfec-017b-1be7-c8533561ecad
const circularReferenceItemsResponse =
  require('./circularReferenceItemsResponse.json');
const fakeTypeResponse =
  require('./fakeTypeResponse.json');

describe(`Circular reference in modular content`, async () => {
  const fakeHttpServiceConfig = new Map();
  fakeHttpServiceConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/items/,
    {
      fakeResponseJson: circularReferenceItemsResponse,
      throwError: false,
    });
  fakeHttpServiceConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/types/,
    {
      fakeResponseJson: fakeTypeResponse,
      throwError: false,
    });

  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

  const createNodeMock = jest.fn();
  const actions = {
    actions: {
      createNode: createNodeMock,
    },
    createNodeId: dummyCreateNodeID,
  };

  const deliveryClientConfig = {
    projectId: 'dummyProject',
    typeResolvers: [],
    httpService: new KontentTestHttpService(
      fakeHttpServiceConfig
    ),
  };

  const pluginConfiguration = {
    deliveryClientConfig,
    languageCodenames: ['default'],
  };

  it('passes with no error', async () => {
    await sourceNodes(actions, pluginConfiguration);

    const calls = createNodeMock.mock.calls;
    expect(calls).toMatchSnapshot();
  });
});
