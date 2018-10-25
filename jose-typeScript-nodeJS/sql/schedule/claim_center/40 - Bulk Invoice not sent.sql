select bi.InvoiceNumber, bis.TYPECODE, bis.L_pt as Status
from cc_bulkinvoice bi
inner join cctl_bulkinvoicestatus bis
    on bis.ID = bi.Status
where bi.ScheduledSendDate < getdate()
  and bis.TYPECODE in ('pendingitemvalidation')
