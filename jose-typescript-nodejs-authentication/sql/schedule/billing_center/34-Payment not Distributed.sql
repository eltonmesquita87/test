  select distinct right(RefNumber,2) ,substring(refnumber,9,13), bmr.CreateTime
	from bc_basemoneyreceived bmr
	inner join bc_account a on a.id = bmr.accountid
	inner join bc_invoiceitem ii on ii.InstallmentNumber = cast(right(bmr.RefNumber,2) as INT)
	inner join bc_policyperiod pp on pp.ID = ii.PolicyPeriodID 
	where bmr.subtype in (3,4)
	and refnumber is not null
	and ii.PaidAmount = 0
	and ii.retired = 0
	and pp.policynumber not in (5009110003454)
	and pp.cancelstatus <> 3
	and pp.PolicyNumber = substring(bmr.refnumber,9,13)
	and bmr.CreateTime >= '<month> 00:00:00'
	and bmr.reversaldate is null
	and bmr.retired = 0
	and ISNUMERIC(right(bmr.RefNumber,2)) = 1
