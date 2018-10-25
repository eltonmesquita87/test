select * from 
(select
    p.policynumber,
    c.ClaimNumber,
    ct.L_pt as CostType,
    e.ID as ExposureID,
    stt.L_pt as TransactionCode,
    tsc.Tag,
    count(t.ID) as Quantity
from ccx_transactionsapcode_gcs tsc
inner join cctl_saptransactiontype_gcs stt
    on stt.ID = tsc.SAPTransactionType_GCS
inner join cc_transaction t
    on t.ID = tsc.TransactionSAP
inner join cc_exposure e
    on e.ID = t.ExposureID
inner join cctl_costtype ct
    on ct.ID = t.CostType
inner join cc_claim c
    on c.ID = e.ClaimID
inner join cc_policy p on p.id = c.policyid
where tsc.Tag = 'OPEN'
  and (
    (stt.TYPECODE = 'GWDG_02101' and t.CreateTime >= '2018-03-20 0:0:0') or
    (stt.TYPECODE = 'GWDG_02106' and t.CreateTime >= '2018-06-28 0:0:0')
  )
group by
    p.policynumber,
    c.ClaimNumber,
    ct.L_pt,
    e.ID,
    stt.L_pt,
    tsc.Tag
having count(t.ID) > 1
) a
where 1 = 1
