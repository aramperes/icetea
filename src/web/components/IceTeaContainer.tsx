import * as React from "react";
import "./IceTeaContainer.css"

export interface IceTeaContainerProps {
}

export default class IceTeaContainer extends React.Component<IceTeaContainerProps, {}> {
  render() {
    return (
      <div className="IceTeaContainer-global">
        <p>Hello from IceTea.</p>
      </div>
    );
  }
}
