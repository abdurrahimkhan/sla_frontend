CREATE trigger  backup_before_delete
ON [INOC].[dbo].[Transport_Tickets]
INSTEAD OF DELETE
AS BEGIN
INSERT INTO [INOC].[dbo].[BACKUP_TABLE] SELECT * from Transport_Tickets
DELETE from Transport_Tickets
END;