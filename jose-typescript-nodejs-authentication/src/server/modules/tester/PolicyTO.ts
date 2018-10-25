
export class PolicyTO {

  private policyNumber: number 
  private product: string
  private logic: number

  constructor() {

  }

  public get PolicyNumber(): number {
    return this.policyNumber;
  }

  public set PolicyNumber(policyNumber: number) {
    this.policyNumber = policyNumber;
  } 

  public get Product(): string {
    return this.product;
  }

  public set Product(product: string) {
    this.product = product;
  }

  public get Logic(): number {
    return this.logic;
  }

  public set Logic(logic: number) {
    this.logic = logic;
  }

}

export default PolicyTO;