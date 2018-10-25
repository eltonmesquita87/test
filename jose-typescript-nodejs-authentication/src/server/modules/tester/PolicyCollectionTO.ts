import PolicyTO from './PolicyTO';


export class PolicyCollectionTO {

  externalProposalNumber: number 
  date: Date
  policies: Array<PolicyTO>  

  constructor() {
    this.policies = new Array<PolicyTO>();
  }

  public get ExternalProposalNumber(): number {
    return this.externalProposalNumber;
  }

  public set ExternalProposalNumber(externalProposalNumber: number) {
    this.externalProposalNumber = externalProposalNumber;
  } 

  public get Date(): Date {
    return this.date;
  }

  public set Date(date: Date) {
    this.date = date;
  }

  public get Policies(): Array<PolicyTO> {
    return this.policies;
  }

  public set Policies(policies: Array<PolicyTO>) {
    this.policies = policies;
  }

  public addPolicy(policy: PolicyTO): void {
    this.policies.push(policy);
  }

}

export default PolicyCollectionTO;