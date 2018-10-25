select distinct pp.Policynumber, bdi.createtime BaseDistItem, bi.createtime CancellationDate	  
from 	   
bc_basedistitem bdi 
inner join bc_basedist bd on bdi.ActiveDistID = bd.id
inner join bc_basemoneyreceived bmr on bmr.baseDistId = bd.id
inner join bc_invoiceitem ii on ii.id = bdi.InvoiceItemID
inner join bc_policyperiod pp on ii.PolicyPeriodID = pp.id
inner join bc_billinginstruction bi on bi.associatedpolicyperiodid = pp.id
where bdi.retired = 0
and bd.retired = 0
and ii.retired = 0
and pp.retired = 0	
and bi.subtype = 4
and bdi.CreateTime > bi.createtime
and bmr.subtype in ( 3 , 4 )

