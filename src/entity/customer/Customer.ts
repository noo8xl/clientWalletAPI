import {IsEmail,IsInstance,IsString} from "class-validator";
import {CustomerDetails} from "./CustomerDetails";


export class Customer {

	@IsString()
	private _id: string

	@IsEmail()
	private userEmail: string
	@IsString()
	private domainName: string
	@IsString()
	private companyName: string
	@IsString()
	private apiKey: string

	@IsInstance(CustomerDetails)
	private customerDetails: CustomerDetails

	constructor() {}

	public setCustomer(id: string, email: string, domainName: string, companyName: string, apiKey: string): void {
		this._id = id
		this.userEmail = email
		this.domainName = domainName
		this.companyName = companyName
		this.apiKey = apiKey
	}

	public getId(): any {
		return this._id
	}

	public setCustomerDetails(customerDetails: CustomerDetails): void {
		this.customerDetails = customerDetails
	}

	public getCustomer(): Customer {
		return this;
	}
}