/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface MockDataOptions {
  customData?: any;
  quantityToGenerate?: number;
}

export type MockType<T> = {
  [P in keyof T]: jest.Mock<T>;
};

function customObjectPropertyOverload(index: string | number, customData: any, mockedData: any[]) {
  const dataPropertyKeys = Object.keys(customData || {});

  for (const dataIndex of dataPropertyKeys) {
    const dataSubProperties = Object.keys(customData[dataIndex]);

    if (typeof customData[dataIndex] !== "object") {
      mockedData[index][dataIndex] = customData[dataIndex];
    } else {
      for (const dataSubIndex of dataSubProperties) {
        mockedData[index][dataIndex][dataSubIndex] = customData[dataIndex][dataSubIndex];
      }
    }
  }

  return mockedData;
}

/**
 * Create a mock data with the given entity and custom data
 * @param entityObject {T[]} An generic array with entity objects
 * @param customData {Partial<T>} An object with custom data to be added to the entity
 * @returns
 */
export function createMockData(entityObject: any[], customData: any = {}) {
  let mockedData: any[] = [];
  const quantityToGenerate = entityObject.length || 1;

  for (const [index, entity] of Object.entries(entityObject)) {
    mockedData.push(entity);

    mockedData = customObjectPropertyOverload(index, customData, mockedData);
  }
  return quantityToGenerate > 1 ? mockedData : mockedData.shift();
}
