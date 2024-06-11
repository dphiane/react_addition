/*
  const [ searchStart, setSearchStart ] = useState<Date | null>(new Date());
  const [ searchEnd, setSearchEnd ] = useState<Date | null>(null);
  const [ startDate, setStartDate ] = useState('');
  const [ endDate, setEndDate ] = useState('');
  const [ data, setData ] = useState<InvoiceInterface[] | null>(null);
  const [ total, setTotal ] = useState<number>(0);
  const [ averageBasket, setAverageBasket ] = useState<number>(0)
  const [paymentsMethodTotal, setPaymentsMethodTotal] = useState<{ method: string,count: number, total: number }[] | null>(null);
  useEffect(() => {
    if (searchStart !== null) {
      const formatedDate = formatDateForResearch(searchStart)
      setStartDate(formatedDate);
    }
  }, [ searchStart ]);

  useEffect(() => {
    if (searchEnd !== null) {
      const formatedDate = formatDateForResearch(searchEnd)
      setEndDate(formatedDate);
    }
  }, [ searchEnd ]);


  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [data]);

  const handleSearchStart = (value: Date) => {
    setErrors('')
    if (searchEnd !== null) {
      if (value > searchEnd) {
        setErrors("Votre date de début ne peut pas être supérieur à celle de fin")
        console.log(errors)
        return;
      }
    }
    setSearchStart(value);
  }

  const handleSearchEnd = (value: Date) => {
    setErrors('')
    if (searchEnd !== null) {
      if (value < searchEnd) {
        setErrors("Votre date de fin ne peut pas être inférieur à celle du début")
        return;
      }
    }
    setSearchEnd(value);
  }

  const fetchData = async () => {
    setErrors('');
    try {
      const response = await fetchInvoicesByDate(startDate, endDate);
      console.log("Fetched data:", response);
      setData(response);
      const totalSum = response.reduce((acc, invoice) => acc + invoice.total, 0);
      setTotal(totalSum);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrors("Une erreur s'est produite lors de la récupération des données.");
    }
  }
  const fetchPayments = async () => {
    if (data !== null) {
      const average = total / data.length;
      setAverageBasket(average);
      const paymentIRIs = data.flatMap(invoice => invoice.payment);
      const payments = await fetchPaymentsByIri(paymentIRIs);
      const filteredPayments = payments.map(payment => ({
        amount: payment.amount,
        paymentMethod: payment.paymentMethod
      }));

      const paymentTotalsMap: { [key: string]: { total: number, count: number } } = {};
      filteredPayments.forEach(payment => {
        if (paymentTotalsMap[payment.paymentMethod]) {
          paymentTotalsMap[payment.paymentMethod].total += payment.amount;
          paymentTotalsMap[payment.paymentMethod].count += 1;
        } else {
          paymentTotalsMap[payment.paymentMethod] = { total: payment.amount, count: 1 };
        }
      });

      const paymentTotalsArray = Object.keys(paymentTotalsMap).map(method => ({
        method,
        count: paymentTotalsMap[method].count,
        total: paymentTotalsMap[method].total
      }));

      setPaymentsMethodTotal(paymentTotalsArray);
      console.log("Payment Totals:", paymentTotalsArray);
    }
  }      
<DatePicker
selected={searchStart}
onChange={(date: Date) => handleSearchStart(date)}
dateFormat="dd/MM/yyyy"
className="text-center rounded border-0 p-1"
placeholderText="Date de début"
locale="fr"
/>
<div className="d-flex align-items-center">
<i className="activity-icon-arrow-right fa-solid fa-arrow-right text-light fa-xl"></i>
</div>
<DatePicker
selected={searchEnd}
onChange={(date: Date) => handleSearchEnd(date)}
dateFormat="dd/MM/yyyy"
className="text-center rounded border-0 p-1"
placeholderText="Date de fin"
locale="fr"
/>
<Button className="p-1" onClick={() => fetchData()}><i className="fa-solid fa-magnifying-glass ps-1 pe-1"></i></Button> */