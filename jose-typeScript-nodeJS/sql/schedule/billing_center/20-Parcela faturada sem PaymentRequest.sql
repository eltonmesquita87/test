select distinct pp.PolicyNumber,i.EventDate,ii.InstallmentNumber
from bc_invoice i
inner join bc_invoiceitem ii on ii.InvoiceID = i.ID
inner join bc_policyperiod pp on pp.ID = ii.PolicyPeriodID
left join bc_paymentrequest pr on pr.InvoiceID = i.ID
where 
i.EventDate > '2016-12-01 00:00:00.0000000'
and  pr.ID is null 
and pp.CancelStatus = 1
and pp.policynumber like '500911%'
and i.Status = 2
