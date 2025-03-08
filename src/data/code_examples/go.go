func main() {
	apiCfg := apiConfig{}

	db, err := sql.Open("sqlite3", "./tmlwiz.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	apiCfg.DB = db

	fxRatesApiKey = os.Getenv("FX_RATES_API_KEY")
	apiCfg.fxRatesApiKey = fxRatesApiKey
	apiCfg.getTokenData()
	apiCfg.getCurrencyRates()

	fs := http.FileServer(http.Dir("./static/"))
	http.HandleFunc("/", apiCfg.handlerGetData)
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Refresh token data and currency rates based on updateFrequency
	updateFrequency := 10 * time.Minute
	ticker := time.NewTicker(updateFrequency)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				apiCfg.getTokenData()
				apiCfg.getCurrencyRates()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()

	port := "8080"
	log.Printf("listening on %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

}