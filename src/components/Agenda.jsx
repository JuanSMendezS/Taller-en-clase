import React from 'react'
import { firebase } from '../firebase.js'
import { Modal } from 'react-bootstrap'


const Formulario = () => {

    const [id, setId] = React.useState('')
    const [nombre, setNombre] = React.useState('')
    const [apellido, setApellido] = React.useState('')
    const [numeroTel, setNumeroTel] = React.useState('')
    const [relacion, setRelacion] = React.useState('')
    const [organizacion, setOrganizacion] = React.useState('')
    const [listaContacto, setListaContactos] = React.useState([])
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [showModal, setShowModal] = React.useState(false);
    const [imag, setImag] = React.useState("");
    //const imagen = 'https://picsum.photos/100'
    const texto_alt = 'Imagen de origen de Picsum'

  
        const Imagen = async()=>{
            try {
                const res = await fetch('https://picsum.photos/100');
                console.log(res.url)
                return await res.url
            } catch (error) {
                console.error(error);
            }
        }
       
  

    React.useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const dataBase = firebase.firestore()
                const data = await dataBase.collection('listaContacto').get()
                const arrayData = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))

                console.log(arrayData)
                setListaContactos(arrayData)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos()
    }, [])

    const guardarContacto = async () => {
        

        if (!nombre.trim()) {
            setError('Agregue el nombre')
            return
        }
        if (!numeroTel.trim()) {
            setError('Agregue el número de telefono de la persona')
            return
        }
        if (!apellido.trim()) {
            setError('Agregue el apellido')
            return
        }
        if (!organizacion.trim()) {
            setError('Agregue la organización')
            return
        }
        if (!relacion.trim()) {
            setError('Especifique la relación')
            return
        }

        try {
            const imag = await Imagen();
            const dataBase = await firebase.firestore();
            const nuevoRegistro = {
                Nombre: nombre,
                Apellido: apellido,
                NumeroTel: numeroTel,
                Organizacion: organizacion,
                Relacion: relacion,
                imag
            };
            const data = await dataBase.collection('listaContacto').add(nuevoRegistro)
            console.log(data)
            setListaContactos([...listaContacto,
            {
                Nombre: nombre,
                Apellido: apellido,
                NumeroTel: numeroTel,
                Organizacion: organizacion,
                Relacion: relacion,
                imag
            }
            ])

            
            setNombre('')
            setApellido('')
            setNumeroTel('')
            setOrganizacion('')
            setRelacion('')
            handleModal()
        } catch (error) {
            console.log(error)
        }
    }

    const editar = item => {
        setNombre(item.Nombre)
        setNumeroTel(item.NumeroTel)
        setApellido(item.Apellido)
        setOrganizacion(item.Organizacion)
        setRelacion(item.Relacion)
        setModoEdicion(true)
        setId(item.id)
        setImag(item.imag)
    }

    const editarContacto = async (e) => {
        e.preventDefault();

        try {
            const dataBase = firebase.firestore();
            await dataBase.collection('listaContacto').doc(id).update({
                id: id,
                Nombre: nombre,
                Apellido: apellido,
                NumeroTel: numeroTel,
                Organizacion: organizacion,
                Relacion: relacion,
                imag
            })

            const registroEditado = listaContacto.map(
                item => item.id === id ? {
                    id: id,
                    Nombre: nombre,
                    Apellido: apellido,
                    NumeroTel: numeroTel,
                    Organizacion: organizacion,
                    Relacion: relacion,
                    imag
                } : item
            )

            setListaContactos(registroEditado)

            
            setNombre('')
            setApellido('')
            setNumeroTel('')
            setOrganizacion('')
            setRelacion('')
            setModoEdicion(false)
            setError(null)
            handleModal()
            e.target.reset();
        } catch (error) {
            console.log(error)
        }

    }

    const eliminar = id => {
        try {
            const dataBase = firebase.firestore()
            dataBase.collection('listaContacto').doc(id).delete()
            const aux = listaContacto.filter(item => item.id !== id)
            setListaContactos(aux)
        } catch (error) {
            console.log(error)
        }
    }

    const cancelar = () => {
        setModoEdicion(false)
        setId('')
        setNombre('')
        setApellido('')
        setNumeroTel('')
        setOrganizacion('')
        setRelacion('')
        setError(null)
        handleModal()
    }

    const handleModal = () => {
        setShowModal(!showModal)
    }

    return (
        <>
            <div className='col-4'>
                <h4 className="Btn" style={{position: 'fixed', top: '50%', right: 200}}>
                    <button onClick={handleModal}> Abrir formulario</button>
                </h4>
            </div>
            <Modal show={showModal} onHide={handleModal}>
                <Modal.Header closeButton>
                    {
                        modoEdicion ? 'Editar datos' : 'Agregar datos'
                    }
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={modoEdicion ?? editarContacto }>
                        {
                            error ? <span className='text-danger'>{error}</span> : null
                        }
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese nombre'
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese el apellido'
                            type="text"
                            onChange={(e) => setApellido(e.target.value)}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese número del contacto'
                            type="text"
                            onChange={(e) => setNumeroTel(e.target.value)}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese la organización o grupo que pertenece'
                            type="text"
                            onChange={(e) => setOrganizacion(e.target.value)}
                        />
                        <input
                            className='form-control mb-2'
                            placeholder='Ingrese su relación'
                            type="text"
                            onChange={(e) => setRelacion(e.target.value)}
                        />

                    </form>
                </Modal.Body>
                <Modal.Footer>

                    {
                        modoEdicion ?
                            (
                                <>
                                    <button
                                        className='btn btn-warning btn-block'
                                        type='submit'
                                    >Editar</button>
                                    <button
                                        className='btn btn-darck btn-block mx-2'
                                        onClick={() => cancelar()}
                                    >Cancelar</button>
                                </>
                            )
                            :
                            <button
                                className='btn btn-primary btn-block'
                                onClick={guardarContacto}>
                                Agregar
                            </button>
                    }
                </Modal.Footer>
            </Modal>
            <div className='container mt-5'>
                <h2 className='text-center'>Agenda</h2>
                <hr />
                <div className='row'>
                    <div className='col-8'>
                        <h4 className='text-center'> Listado de Contactos </h4>
                        <ul className='list-group'>
                            {
                                listaContacto.map((item) => (
                                    
                                        <li className='list-group-item' key={item.id}>
                                        <span className='lead'>
                                            {item.Nombre}<hr />
                                            {item.Apellido}<hr />
                                            {item.NumeroTel}<hr />
                                            {item.Organizacion}<hr />
                                            {item.Relacion}<hr />
                                            <img src={item.imag} alt={texto_alt} />
                                        </span>
                                        <hr />
                                        <button className='btn btn-danger btn-sm float-end mx-2' onClick={() => eliminar(item.id)}>
                                            Eliminar
                                        </button>
                                        <button className='btn btn-warning btn-sm float-end' onClick={() => editar(item)}>
                                            Editar
                                        </button>
                                        </li>
                                    
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Formulario