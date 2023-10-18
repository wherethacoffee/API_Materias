import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';

import './App.css'

function App() {
  const { control, handleSubmit, reset, watch } = useForm()
  const [data, setData] = useState(null)


  const onSubmit = async (formData) => {
    try {
      const response = await fetch('https://scompcenter.com/david/rest_api_alu_materias_daw/api/create_materia.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          title: 'Exito',
          icon: 'success',
          text: 'La materia se agregó correctamente'
        })
        reset();
        fetchData();
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Hubo un error al enviar los datos a la API'
        })
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Ocurrió un error inesperado'
      })
    }
  };

  const handleDelete = async (formData) => {
    const url = 'https://scompcenter.com/david/rest_api_alu_materias_daw/api/delete_materia.php'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        
        body: JSON.stringify(formData),
      });
      
      console.log('Response:', response);
      
      if (response.ok) {
        Swal.fire({
          title: 'Exito',
          icon: 'success',
          text: `La materia se eliminó correctamente`
        })
        reset();
        fetchData();
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Hubo un error al enviar los datos a la API'
        })
      }
      
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: error
      });
    }
  };
  

  const handleUpdate = async (formData) => {
    try {
      console.log(JSON.stringify(formData));
      const response = await fetch('https://scompcenter.com/david/rest_api_alu_materias_daw/api/update_materia.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          title: 'Exito',
          icon: 'success',
          text: `La materia se actualizó correctamente`
        })
        reset();
        fetchData();
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'Hubo un error al enviar los datos a la API'
        })
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: error
      })
    }
  };

  const handleUpdateClick = () => {
    // Obtén los valores actuales del formulario
    const formData = {
      cve_plan: watch("cve_plan"),
      grado: watch("grado"),
      clave: watch("clave"),
      materia: watch("materia"),
      horas_prac: watch("horas_prac"),
      horas_teo: watch("horas_teo"),
      creditos: watch("creditos"),
    };
  
    // Realiza la validación manualmente
    if (formularioEsValido(formData)) {
      // Si el formulario es válido, realiza la solicitud de actualización
      handleUpdate(formData);
    } else {
      // Si el formulario no es válido, muestra un mensaje de error
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Por favor, rellena todos los campos antes de actualizar.',
      });
    }
  };

  const handleDeleteClick = () => {
    // Obtén los valores actuales del formulario
    const cvePlan = watch("cve_plan");
    const clave = watch("clave");
  
    // Realiza la validación manualmente
    if (cvePlan && clave) {
      // Si los campos de Cve plan y clave están llenos, realiza la solicitud de eliminación
      handleDelete({ cve_plan: cvePlan, clave: clave });
    } else {
      // Si los campos de Cve plan y clave están vacíos, muestra un mensaje de error
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Por favor, proporciona Cve plan y clave para eliminar.',
      });
    }
  };
  
  
  const formularioEsValido = (formData) => {
    // Implementa lógica de validación aquí
    // Por ejemplo, puedes verificar si todos los campos obligatorios están llenos
    return (
      formData.cve_plan &&
      formData.grado &&
      formData.clave &&
      formData.materia &&
      formData.horas_prac &&
      formData.horas_teo &&
      formData.creditos
    );
  };
  
  const fetchOne = async (formData) => {
    const cve = formData["cve_plan"];
    const clv = formData["clave"];


    try {
      const response = await fetch(`https://scompcenter.com/david/rest_api_alu_materias_daw/api/busca_plan_materia.php?cve_plan=${cve}&&clave=${clv}`);
    if (response.ok) {
      const data = await response.json();
      const materiaInfo = `CVE plan: ${data.cve_plan} <br>
                          \nGrado: ${data.grado} <br>
                          \nClave: ${data.clave} <br>
                          \nMateria: ${data.materia} <br>
                          \nHoras prácticas: ${data.horas_prac} <br>
                          \nHoras teóricas: ${data.horas_teo} <br>
                          \nCréditos: ${data.creditos}`;
      Swal.fire({
          title: 'Datos de la materia',
          icon: 'info',
          html: materiaInfo
        })
        fetchData();
    } else {
    Swal.fire({
      title: 'Error',
      icon: 'error',
      text: 'La materia no esta registrada, favor de ingresar Cve Plan y Clave',
    });
  }
} catch (error) {
  console.error('Error in the request:', error);
  Swal.fire({
    title: 'Error',
    icon: 'error',
    text: error
  });
  };  
}
  const fetchData = () => {
    fetch('https://scompcenter.com/david/rest_api_alu_materias_daw/api/lista_planes_materias.php')
    .then((response) => response.json())
    .then((data) => setData(data.body))
    .catch((error) => console.error('Error en obtener los datos:', error));
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand">CRUD Materias</a>
      </nav>
      <div className="container">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label>Cve Plan</label>
                    <Controller
                      name="cve_plan"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Grado</label>
                    <Controller
                      name="grado"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Clave</label>
                    <Controller
                      name="clave"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Materia</label>
                    <Controller
                      name="materia"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control"type='text' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Horas Prácticas</label>
                    <Controller
                      name="horas_prac"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Horas Teóricas</label>
                    <Controller
                      name="horas_teo"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <div className="form-group">
                    <label>Créditos</label>
                    <Controller
                      name="creditos"
                      control={control}
                      defaultValue=""
                      render={({ field }) => <input {...field} className="form-control" type='number' required/>}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => fetchOne(
                      {cve_plan: watch("cve_plan"),
                      clave: watch("clave")
                      })}>
                    Buscar
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={handleUpdateClick}
                  >
                  Actualizar
                  </button>
                  <button
  type="button"
  className="btn btn-danger"
  onClick={handleDeleteClick}
>
  Eliminar
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-7">
            <table className="table table-bordered table-hover">
            <thead>
                <tr>
                  <th>Cve Plan</th>
                  <th>Grado</th>
                  <th>Clave</th>
                  <th>Materia</th>
                  <th>Horas Prácticas</th>
                  <th>Horas Teóricas</th>
                  <th>Créditos</th>
                </tr>
              </thead>
              <tbody>
                {data && data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cve_plan}</td>
                    <td>{item.grado}</td>
                    <td>{item.clave}</td>
                    <td>{item.materia}</td>
                    <td>{item.horas_prac}</td>
                    <td>{item.horas_teo}</td>
                    <td>{item.creditos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
          <div>
            <footer className="footer" class="footer derechos-reservados" id="derechos-reservados">
              <p>&copy; 2023 Todos los derechos reservados Ricardo Rodriguez</p>
            </footer>
          </div>
          </div>
      </div>
      </div>
  );
}

export default App