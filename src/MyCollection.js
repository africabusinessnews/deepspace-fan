import React, { useEffect, useState } from "react";
import axios from "axios";
import Planet from "./Planet";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
const MyCollection = (props) => {
  const [collections, setCollections] = useState([]);

  const [divWidth, setdivWidth] = useState(0);

  const getImage = async (tokenId) => {
    try {
      const { data } = await axios.get(
        //todo: verify this is correct
        `https://cloud-cube-us2.s3.amazonaws.com/deepspace/public/planet/metadata/${tokenId}`
      );
      return data.image;
    } catch {
      return "bad url";
    }
  };

  useEffect(() => {
    const loadTwice = async () => {
      if (Array.isArray(props.collection)) {
        let sortedCollection = [...props.collection];
        sortedCollection.sort((first, second) =>
          Number(first.tokenId) > Number(second.tokenId) ? 1 : -1
        );
        setCollections(sortedCollection);

        let items = [];
        await Promise.all(
          sortedCollection.map(async (item) => {
            const image = await getImage(item.tokenId);
            const itemTemp = {
              tokenId: item.tokenId,
              amountOwed: item.amountOwed,
              image: image,
            };
            items.push(itemTemp);
          })
        );

        items.sort((first, second) =>
          Number(first.tokenId) > Number(second.tokenId) ? 1 : -1
        );

        setCollections(items);
      }
    };

    loadTwice();

    const divWidth = document.querySelectorAll(".card").offsetWidth;
    setdivWidth(divWidth);
  }, [props.collection, props.walletRefreshNum]);

  return (
    <div className="my_collection">
      <div className="collectionTitle">
        <h6>My collection</h6>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {collections.length > 0 &&
          collections.map((item, indx) => (
            <Col>
            <Planet tokenidprop={item.tokenId} owed={props.web3.utils.fromWei(item.amountOwed,"ether")} />
            
            </Col>
          ))}
      </Row>
      {collections.length <= 0 && (
        <div className="noItem">
          <h4>There is nothing to display</h4>
        </div>
      )}
    </div>
  );
};

export default MyCollection;
