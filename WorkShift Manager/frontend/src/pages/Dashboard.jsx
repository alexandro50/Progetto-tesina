function Dashboard() {

    return (
        <div className="container-fluid p-4">

            <h1 className="fw-bold">
                WorkShift Manager
            </h1>

            <p className="text-muted">
                Dashboard gestione turni aziendali
            </p>


            <div className="row mt-4">


                <div className="col-md-4">
                    <div className="card shadow p-3">
                        <h5>Dipendenti</h5>
                        <h2>124</h2>
                        <span className="text-success">
                            +8 questo mese
                        </span>
                    </div>
                </div>



                <div className="col-md-4">
                    <div className="card shadow p-3">
                        <h5>Ore lavorate oggi</h5>
                        <h2>856 h</h2>
                        <span className="text-primary">
                            Aggiornamento automatico
                        </span>
                    </div>
                </div>



                <div className="col-md-4">
                    <div className="card shadow p-3">
                        <h5>Turni attivi</h5>
                        <h2>42</h2>
                        <span className="text-warning">
                            5 in corso
                        </span>
                    </div>
                </div>


            </div>


            <div className="card shadow mt-5 p-4">

                <h4>
                    Turni di oggi
                </h4>

                <table className="table mt-3">

                    <thead>
                        <tr>
                            <th>Dipendente</th>
                            <th>Turno</th>
                            <th>Orario</th>
                            <th>Stato</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>Mario Rossi</td>
                            <td>Mattina</td>
                            <td>06:00 - 14:00</td>
                            <td className="text-success">
                                Attivo
                            </td>
                        </tr>


                        <tr>
                            <td>Luca Bianchi</td>
                            <td>Pomeriggio</td>
                            <td>14:00 - 22:00</td>
                            <td className="text-warning">
                                In attesa
                            </td>
                        </tr>


                    </tbody>


                </table>


            </div>


        </div>
    )
}


export default Dashboard;