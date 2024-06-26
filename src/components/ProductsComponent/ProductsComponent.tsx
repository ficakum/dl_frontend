import { Button, Pagination, TextField } from '@mui/material'
import CreateOrder from '../../components/CreateOrder'
import Product from '../../components/Product/Product'
import { Status } from '../../constants/order'
import { IUser, Order, Product as ProductModel, initialOrder, initialUser } from '../../models'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { getLoggedInUser } from '../../services/Auth'
import { createOrder } from '../../services/Order'
import { getProducts, getSimilarProductsByImage } from '../../services/Product'
import './ProductsComponent.scss'

const ProductsComponent = () => {
  const [products, setProducts] = useState<ProductModel[]>([])
  const [orderedProducts, setOrderedProduct] = useState<
    { product: ProductModel; numberOfProducts: number }[]
  >([])
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalCount, setTotalCount] = useState<number>(0)
  const [user, setUser] = useState<IUser>(initialUser)
  const [order, setOrder] = useState<Order>(initialOrder)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const typeInputRef = useRef<HTMLInputElement | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    let price = 0
    orderedProducts.map((product) => {
      price += product.numberOfProducts * product.product.price
    })

    setTotalPrice(price)
  }, [orderedProducts.length])

  useEffect(() => {
    getLoggedInUser().then((user) => setUser(user))
    getProducts(1, 10).then((response) => {
      setProducts(response.items)
      setPage(response.currentPage)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    })
  }, [])

  const cancelOrder = () => {
    setOrderedProduct([])
  }

  const handleProductOrder = (product: ProductModel, numberOfProducts: number) => {
    const updatedOrder: Order = {
      _id: '',
      owner: user._id,
      status: Status.UNPAID,
      orderPrice: order.orderPrice + product.price * numberOfProducts,
      products: order.products,
    }

    updatedOrder.products.push({ productId: product._id, numberOfProducts })

    setOrder(updatedOrder)

    const orderedProductsNew = orderedProducts
    orderedProductsNew.push({ product, numberOfProducts })
    setOrderedProduct(orderedProductsNew)
  }

  const handleOrder = () => {
    createOrder({
      orderPrice: order.orderPrice,
      owner: order.owner,
      products: order.products,
      status: Status.UNPAID,
    })
      .then(() => {
        setOrder(initialOrder)
        setOrderedProduct([])
      })
      .catch((err) => console.log(err))
  }

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    const name = nameInputRef.current?.value
    const type = typeInputRef.current?.value

    getProducts(value, 10, name, type)
      .then((response) => {
        setProducts(response.items)
        setPage(response.currentPage)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
      })
      .catch((error: unknown) => {
        console.log(error)
      })
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedImage) return

    const formData = new FormData()
    formData.append('image', selectedImage)

    getSimilarProductsByImage(formData).then((products) => {
      setProducts(products)
      setPage(1)
      setTotalPages(1)
      setTotalCount(products.length)
    })
  }

  const onFilterProducts = () => {
    if (!nameInputRef.current && !typeInputRef.current) {
      alert('Enter name or type of a product to filter them')
      return
    }

    const name = nameInputRef.current?.value
    const type = typeInputRef.current?.value

    getProducts(1, 10, name, type).then((response) => {
      setProducts(response.items)
      setPage(response.currentPage)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    })
  }

  return (
    <div className='products'>
      <div className='products-filters'>
        <div>
          <h2>Search products similar to your image</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              type='file'
              inputProps={{ accept: 'image/*' }}
              variant='outlined'
              onChange={handleImageChange}
            />
            <Button type='submit'>Upload</Button>
          </form>
        </div>
        <div className='products-filters-text'>
          <div>
            <h2>Search products by name</h2>
            <TextField placeholder='Enter name of the product' inputRef={nameInputRef} />
          </div>
          <div>
            <h2>Search products by type</h2>
            <TextField placeholder='Enter type of the product' inputRef={typeInputRef} />
          </div>
          <Button onClick={onFilterProducts}>Filter products</Button>
        </div>
      </div>
      <div className='products-section'>
        {products.map((product) => (
          <Product key={product._id} product={product} handleProductOrder={handleProductOrder} />
        ))}
      </div>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color='primary'
        size='large'
      />
      <Button onClick={handleOrder}>Make an order</Button>
      <Button onClick={cancelOrder}>Cancel an order</Button>
      <CreateOrder orderedProducts={orderedProducts} totalPrice={totalPrice} />
    </div>
  )
}

export default ProductsComponent
