SELECT DISTINCT pp.policynumber,ii.InstallmentNumber,i.InvoiceNumber,i.eventdate--,bi.*
  FROM bc_invoiceitem ii
 INNER JOIN bc_invoice i on i.id = ii.InvoiceID
 INNER JOIN bc_policyperiod pp on ii.PolicyPeriodID = pp.id
 INNER JOIN bc_charge c on c.id = ii.ChargeID
 INNER JOIN bc_billinginstruction bi on bi.id = c.BillingInstructionID
 WHERE ii.retired = 0
   AND pp.retired = 0	
   AND bi.subtype = 5
   AND i.retired = 0
   AND ii.installmentnumber > 1
   AND pp.policynumber like '500911%'
   AND pp.policynumber NOT IN (SELECT policynumber 
                                 FROM <policycenter>.dbo.pc_policyperiod 
								WHERE cancellationdate is not null)
   AND i.EndorsementNumber_GCS is null
   AND i.EventDate < getdate()-1
   AND pp.cancelstatus <> 3
   AND i.EventDate > '2016-12-01 00:00:00'
