import React from 'react'

interface Props {
  children: React.ReactNode
}

const Field: React.FC<Props> = ({children}) => {
    return <div className="flex flex-col items-start mb-3 gap-y-3">{children}</div>;

}

export default Field