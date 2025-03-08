SELECT COALESCE(
    (
        SELECT TOP 1 OrderId 
        FROM dbo.tblPORad 
        WHERE POnr <> OrderId 
          AND CustOrderNo NOT LIKE 'JSA%'
        GROUP BY OrderId 
        HAVING COUNT(CASE WHEN Status != 100 THEN 1 END) = 0 
           AND COUNT(CASE WHEN SentDESADV <> 0 THEN 1 END) = 0
    ), 
-1) AS Result;
