import React from 'react'
import { notification, Modal } from 'antd'
import './notic.css'
export const OpenNotification = (type, message, dsscription, topic, option) => {
  notification[type]({
    message: topic,
    duration: 5,
    description: (
      <div>
        <div>{message}</div>
        <ul>
          {dsscription ? (
            <span>
              {option
                ? dsscription.map(item => (
                    <span>
                      {dsscription[0].length === 0 ? (
                        <li>{option}</li>
                      ) : (
                        <li>{item}</li>
                      )}
                    </span>
                  ))
                : dsscription.map(item => <li>{item}</li>)}
            </span>
          ) : null}
        </ul>
      </div>
    ),
  })
}
