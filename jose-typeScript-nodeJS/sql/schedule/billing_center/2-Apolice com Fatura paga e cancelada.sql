select distinct pp.PolicyNumber, ii.installmentnumber, bi.CreateTime CancellationDate
from bc_invoiceitem ii
inner join bc_policyperiod pp on pp.id = ii.PolicyPeriodID
inner join bc_charge c on c.id = ii.ChargeID
inner join bc_billinginstruction bi on bi.id = c.BillingInstructionID
inner join bc_invoiceitem ii2 on ii2.InstallmentNumber = ii.InstallmentNumber and ii2.PolicyPeriodID = pp.ID
inner join bc_charge c2 on c2.id = ii2.ChargeID
inner join bc_billinginstruction bi2 on bi2.id = c2.BillingInstructionID
inner join bc_basedistitem bdi on bdi.invoiceitemid = ii2.id
inner join bc_basemoneyreceived bmr on bmr.basedistid = bdi.activedistid
where bi.subtype = 4
and bi2.Subtype = 5
and bmr.subtype in(3,4)
and ii.retired = 0
and ii2.retired = 0
and bi.createtime >= '2018-01-01 00:00:00'


