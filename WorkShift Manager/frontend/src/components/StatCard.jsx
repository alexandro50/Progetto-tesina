import { FaUsers, FaClock, FaCalendarCheck, FaUmbrellaBeach } from "react-icons/fa";


const icons = {
    employees: <FaUsers />,
    hours: <FaClock />,
    shifts: <FaCalendarCheck />,
    holidays: <FaUmbrellaBeach />
};


function StatCard({title,value,type}) {

    return (
        <div className="card shadow-sm border-0 p-3 h-100">

            <div className="d-flex justify-content-between align-items-center">

                <div>
                    <p className="text-muted mb-1">
                        {title}
                    </p>

                    <h2 className="fw-bold">
                        {value}
                    </h2>
                </div>


                <div 
                className="fs-1 text-primary">

                    {icons[type]}

                </div>


            </div>

        </div>
    )
}


export default StatCard;