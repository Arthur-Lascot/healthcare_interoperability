export abstract class Resource<T extends string = string> {
  public readonly resourceType: T;
  public id?: string;
  public meta?: any;
  public implicitRules?: string;
  public language?: string;

  protected constructor(resourceType: T, params?: Partial<Resource<T>>) {
    this.resourceType = resourceType;
    if (params) Object.assign(this, params);
  }
}

export default Resource;