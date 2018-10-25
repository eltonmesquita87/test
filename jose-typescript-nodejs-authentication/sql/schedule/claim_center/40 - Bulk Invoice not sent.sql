select distinct bi.InvoiceNumber, bis.TYPECODE, bis.L_pt as Status, biis.TYPECODE
from cc_bulkinvoice bi
inner join cctl_bulkinvoicestatus bis
    on bis.ID = bi.Status
inner join cc_bulkinvoiceitem bii
    on bi.ID = bii.BulkInvoiceID
inner join cctl_bulkinvoiceitemstatus biis
    on biis.ID = bii.Status
where bi.ScheduledSendDate < getdate()
  and bis.TYPECODE in ('pendingitemvalidation')
  and biis.TYPECODE in ('submitting', 'awaitingsubmission')
