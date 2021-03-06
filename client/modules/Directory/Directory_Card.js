
import React from 'react';
import PropTypes from 'prop-types';
import './Directory.css';
import { Card, Icon, Image } from 'semantic-ui-react';


class DirectoryCard extends React.Component {

  render() {
    return (
        <Card className="directoryCard">
            <Image className="cardImage" src={this.props.picture} />
            <Card.Content>
                <Card.Header className="directoryHeader">
                    {this.props.name}
                </Card.Header>
                <Card.Meta className="directoryMeta">
                    <span className="infoSpan">
                        <Icon name="student" />
                      {this.props.school ? this.props.school.name : 'N/A'}
                    </span>
                    <br />
                    <span className="infoSpan">
                        <Icon name="travel" />
                      {this.props.job ? this.props.job.company : 'N/A'}
                    </span>
                </Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <a href={'mailto:' + this.props.email}>
                    <Icon name="user" />
                    {this.props.email}
                </a>
            </Card.Content>
        </Card>
    );
  }
}


DirectoryCard.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  school: PropTypes.object,
  job: PropTypes.object,
  email: PropTypes.string
};


export default DirectoryCard;
