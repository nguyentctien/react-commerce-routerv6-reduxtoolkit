import React, { useState } from 'react';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router';
import PriceChange from '../UI/PriceChange';
import Button from '../UI/Button';
import { ProductItem, QuantityForm } from '../components';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cartSlice';

const DetailPage = () => {
  // get id from url
  const { productId } = useParams();
  // find product by productId
  const data = useRouteLoaderData('root');
  let product = data.find(item => item._id.$oid === productId);

  let longDesc, relatedProducts;
  if (product) {
    longDesc = product.long_desc?.split('\n');
    relatedProducts = data.filter(
      item => item.category === product.category && item._id.$oid !== productId
    );
  }
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const getQuantity = quantity => setQuantity(quantity);

  const cartSubmit = () => {
    let item = {
      id: product._id.$oid,
      name: product.name,
      img: product.img1,
      price: parseInt(product.price),
      // todo
      quantity: parseInt(quantity),
    };
    console.log(item);
    dispatch(cartActions.ADD_CART(item));
  };

  // go to detailPage - RELATED PRODUCTS
  const navigate = useNavigate();
  const getItemOnClick = product => {
    navigate(`/detail/${product._id.$oid}`);
  };
  return (
    <>
      {product && (
        <section id='detail' className='container italic'>
          <div className='flex gap-4 flex-wrap md:flex-nowrap  '>
            {/* img */}
            <div className='img grid grid-cols-[1fr_4fr] content-stretch gap-4 md:flex-1'>
              <div className='imgList flex flex-col '>
                <img src={product.img1} alt='' />
                <img src={product.img2} alt='' />
                <img src={product.img3} alt='' />
                <img src={product.img4} alt='' />
              </div>
              <div>
                <img src={product.img1} alt='' />
              </div>
            </div>
            {/* content */}
            <div className='description flex flex-col gap-3 md:flex-1'>
              <h2>{product.name}</h2>
              <p className='text-lg text-gray-500'>
                <PriceChange price={product.price} /> VND
              </p>
              <p>{product.short_desc}</p>
              <p>
                <strong>CATEGORY:</strong>
                {product.category}
              </p>

              {/* form input */}
              <div className='cart flex items-stretch'>
                <div className='input-group'>
                  <div className='flex-b-c gap-4 border-gray-400 border'>
                    <p className='text-gray-400 p-2'>QUANTITY</p>
                    <QuantityForm
                      onSubmit={getQuantity}
                      quantity={product.quantity}
                      id={product.id}
                    />
                  </div>
                  <Button onClick={cartSubmit}>Add to cart</Button>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 mb-9  flex flex-col items-start gap-3'>
            <Button>DESCRIPTION</Button>
            <h3>PRODUCT DESCRIPTION</h3>
            <div className='longDesc mt-5'>
              {longDesc.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
          <div className='relative'>
            <h3>RELATED PRODUCTS</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4'>
              {relatedProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  product={item}
                  getItemOnClick={getItemOnClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DetailPage;
