import { Fragment } from "react"
import './loading.component.scss'

const Loading = () => {
  return (
    <Fragment>
      <div className="bounce-loading h-[100vh]">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Fragment>
  )
};

export default Loading;
