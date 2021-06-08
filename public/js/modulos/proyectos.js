import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {

    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;


        Swal.fire({
            title: 'Deseas borrar este proyecto ?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'NO, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //enviar petición a Axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(function (respuesa) {
                        console.log(respuesa)
                        
                                        Swal.fire(
                                            'Proyecto eliminado!',
                                            respuesa.data,
                                            'success'
                                        );
                                        //redireccionar al inicio
                                        setTimeout(() => {
                                            window.location.href = '/'
                                        }, 3000);
                    })
                    .catch(()=> {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el Proyecto',
                          })
                    });
            }
        })
    })
}
export default btnEliminar;