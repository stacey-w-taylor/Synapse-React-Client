import * as React from 'react'
import ampIconHeaderSvg from '../../../assets/icons/AMP_AD/consortia-icons/amp-icon-header.svg'
import ampIconSvg from '../../../assets/icons/AMP_AD/consortia-icons/amp-icon.svg'
import moveIconHeaderSvg from '../../../assets/icons/AMP_AD/consortia-icons/move-icon-header.svg'
import moveIconSvg from '../../../assets/icons/AMP_AD/consortia-icons/move-icon.svg'
import ModelADIconHeaderSvg from '../../../assets/icons/AMP_AD/consortia-icons/ModelAD-icon-header.svg'
import ModelADIconSvg from '../../../assets/icons/AMP_AD/consortia-icons/ModelAD-icon.svg'
import resilienceIconHeaderSvg from '../../../assets/icons/AMP_AD/consortia-icons/resilience-icon-header.svg'
import resilienceIconSvg from '../../../assets/icons/AMP_AD/consortia-icons/resilience-icon.svg'

type ConsortiumProps = {
  isHeader?: boolean
  data?: any
  schema?: any
  secondaryLabelLimit?: number
}

export default class Consortium extends React.Component<ConsortiumProps, {}> {

  constructor(props: ConsortiumProps) {
    super(props)
    this.getIcon = this.getIcon.bind(this)
  }

  public getIcon(org: string, isHeader: boolean) {
    // This CAN NOT be refactored below -- dynamic imports are currently not supported
    // in es6, so the code below already has static references to the files below
    // even though its baked into if else clauses.
    const ampIconDescription = "amp-ad icon"
    const moveIconDescription = "M2OVE icon"
    const modelIconDescription = "Model icon"
    const resillienceIconDescription = "Resillience icon"
    switch (org) {
      case 'AMP-AD':
        if (isHeader) {
          return <img alt={ampIconDescription} src={ampIconHeaderSvg}/>
        }
        return <img alt={ampIconDescription} src={ampIconSvg}/>
      case 'M2OVE-AD':
        if (isHeader) {
          return <img alt={moveIconDescription} src={moveIconHeaderSvg}/>
        }
        return <img alt={moveIconDescription} src={moveIconSvg}/>
      case 'MODEL-AD':
        if  (isHeader) {
          return <img alt={modelIconDescription} src={ModelADIconHeaderSvg}/>
        }
        return <img alt={modelIconDescription} src={ModelADIconSvg}/>
      case 'Resilience-AD':
        if (isHeader) {
          return <img alt={resillienceIconDescription} src={resilienceIconHeaderSvg}/>
        }
        return <img alt={resillienceIconDescription} src={resilienceIconSvg}/>
      default:
        return (false)
    }
  }

  public render() {
    const { data, schema } = this.props

    const description = data[schema['Short Description']]
    const name = data[schema['Full Name']]
    const org = data[schema.Program]

    const path = data[schema.Path]
    const orgPath = `${window.location.origin}/#${path}`

    const isOnOrgPath = window.location.hash.substring(1) === path

    return (
      <div
          style={{ paddingBottom: '32px' }}
          className="SRC-portalCard SRC-typeStudy  "
      >
        <div className="SRC-cardThumbnail">
          {this.getIcon(org, isOnOrgPath)}
        </div>
        <div className="SRC-cardContent">
          <div className="SRC-type">Program</div>
          <div >
            <h3>
                {!isOnOrgPath && <a target="_blank" rel="noopener noreferrer" href={orgPath}> {name} </a>}
                {isOnOrgPath && name}
            </h3>
          </div>
          <span className="SRC-font-size-base">
              {description}
          </span>
        </div>
      </div>
    )
  }
}
