import * as React from 'react'
import { PUBLICATION } from '../../utils/SynapseConstants'
import * as Utils from './utils'

type PublicationProps = {
  data?: any
  schema?: any
  secondaryLabelLimit?:number
}

class Publication extends React.Component<PublicationProps, {}> {

  constructor(props: PublicationProps) {
    super(props)
  }

  public render() {
    const { data, schema } = this.props
    const citation = data[schema.citation]
    const tumorType = data[schema.tumorType]
    const diseaseFocus = data[schema.diseaseFocus]
    const doi = data[schema.doi]
    const fundingAgency = data[schema.fundingAgency]
    const projectName = data[schema.projectName]
    const values = [['DOI', doi], ['FUNDER', fundingAgency], ['STUDY', projectName]]
    return (
      <div className="SRC-portalCard SRC-typePublication  ">
          <div className="SRC-cardThumbnail">
              <Utils.Icon type={PUBLICATION} />
          </div>
          <div className="SRC-cardContent">
              <div className="SRC-type">Publication</div>
              <div >
                  <h3>
                      <a target="_blank" rel="noopener noreferrer" href={`https://dx.doi.org/${doi}`}>
                          {citation}
                      </a>
                  </h3>
              </div>
              <div className="SRC-cardAnnotations">
                  <Utils.ChipContainer chips={[tumorType, diseaseFocus]} />
              </div>
          </div>
          <Utils.CardFooter isHeader={false} secondaryLabelLimit={this.props.secondaryLabelLimit} values={values} />
      </div>
    )
  }
}
export default Publication
