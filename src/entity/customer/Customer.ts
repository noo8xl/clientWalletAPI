import {IsEmail,IsInstance,IsString} from "class-validator";
import {CustomerDetails} from "./CustomerDetails";
import {CUSTOMER} from "../../types/customer/customer.types";


export class Customer {

	@IsString()
	private id: string
	@IsEmail()
	private userEmail: string
	@IsString()
	private domainName: string
	@IsString()
	private companyName: string

	@IsInstance(CustomerDetails)
	private customerDetails: CustomerDetails

	constructor() {}

	public setCustomer(candidate: CUSTOMER): void {
		this.id = candidate._id
		this.userEmail = candidate.userEmail
		this.domainName = candidate.domainName
		this.companyName = candidate.companyName
	}

	public getId(): string {
		return this.id
	}

	public getTelegramId(): number {
		return this.customerDetails.getTelegramId();
	}

	public setCustomerDetails(customerDetails: CustomerDetails): void {
		this.customerDetails = customerDetails
	}


	public getFiatName() {
		return this.customerDetails.getFiatName();
	}


	public getCustomer(): Customer {
		return this;
	}
}