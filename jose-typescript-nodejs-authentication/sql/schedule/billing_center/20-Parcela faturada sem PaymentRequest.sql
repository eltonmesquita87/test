select distinct pp.PolicyNumber,i.EventDate,ii.InstallmentNumber
from bc_invoice i
inner join bc_invoiceitem ii on ii.InvoiceID = i.ID
inner join bc_policyperiod pp on pp.ID = ii.PolicyPeriodID
INNER JOIN BC_POLICY P ON p.id = pp.policyid
left join bc_paymentrequest pr on pr.InvoiceID = i.ID
where 
i.EventDate > '<month> 00:00:00.0000000'
and  pr.ID is null 
and pp.CancelStatus = 1
and i.Status = 2
AND P.LOBCODE = 10004
