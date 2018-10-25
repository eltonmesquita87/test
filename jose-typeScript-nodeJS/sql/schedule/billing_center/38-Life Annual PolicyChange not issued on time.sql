select distinct pp.policynumber from bc_policyperiod pp 
where not exists(select 1 from bc_billinginstruction bi 
inner join bc_charge c on c.BillingInstructionID = bi.ID
inner join bc_invoiceitem ii on ii.chargeid = c.ID
where ii.PolicyPeriodID = pp.id
and bi.subtype = 1)
and pp.PolicyNumber like '500911%'
and CAST(pp.PolicyPerEffDate AS DATE) < CAST(GetDate() - 357 AS DATE)
and not exists (select 1 from <PolicyCenter>.dbo.pc_job j inner join <PolicyCenter>.dbo.pc_policyperiod p on p.jobid = j.id 
                where j.subtype = 2 and p.status = 9 and p.PolicyNumber = pp.PolicyNumber)
and pp.PolicyPerEffDate > '2016-05-31 23:59:59'
