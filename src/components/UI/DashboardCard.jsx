import React from 'react'

export default function DashboardCard({ card_heading, card_value, icon }) {
    return (
        <div className="row">
            <div className="col-6 card_heading">
                {icon}
                <span> {card_heading} :</span>
            </div>
            <div className="col-6 card_value">
                <span > {card_value} </span>
            </div>
        </div>
    )
}
