import { useEffect, useState } from "react";
import { useStore } from "../../../../controllers/Auth.js"
import axios from 'axios';
import style from "../../css/postulacion.module.css"

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';


import { AlertaConfirmacionColaboracior, AlertaErrorColaboracior } from "../../js/Alertas.js"
import setScrollTop from "../../../../controllers/setPostScroll.js";

export default function P_Colaborador() {
  const [disponibles, setDisponibles] = useState({ indice: [], data: [] });
  const token = useStore((state) => state.token);
  const id_user = useStore((state) => state.id_user);

  const getDonaciones = () => {
    axios.get('https://proyecto-281-production.up.railway.app/api/delivery/getSolicitudColaborador', {
      headers: {
        "x-token": token,
        "id_user": id_user
      }
    }
    ).then((response) => {
      //console.log(response.data.body.postulaciones);
      console.log(response.data.don);
      setDisponibles({ indice: ["id_solicitud", "nombre", "ap_paterno"], data: response.data.don });
    })
  }

  const postularColaborador = (id_solicitud) => {
    axios.post('https://proyecto-281-production.up.railway.app/api/delivery/postularColaboradorSolicitud', {
      "id_user":parseInt(id_user),   
      "id_solicitud": parseInt(id_solicitud)      
      }, {
        headers: {
          'x-token': token
        }
      })
      .then((response) => {
        if(response.data.ok){
          AlertaConfirmacionColaboracior();
          getDonaciones();  
        }else {
          AlertaErrorColaboracior(); 
        }
      })
      .catch((error)=>{
        console.log(error);
        AlertaErrorColaboracior(); 
      })
  }

  useEffect(() => {
    setScrollTop(0);   
    getDonaciones();
  }, []);

  return (
    <>
      <br></br>
      <h2>Postulacion disponibles a <u>Colaborador</u> de las entregas</h2>      
      <StickyHeadTable setDataTabla={setDisponibles} dataTabla={disponibles} thead={["id_solicitud", "Nombre", "Parterno"]} postularColaborador={postularColaborador} />
    </>
  )

}



function StickyHeadTable({ setDataTabla, dataTabla, thead = ["id"], postularColaborador }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  useEffect(() => {
    console.log(dataTabla)
  }, [])

  return (
    <Paper sx={{ margin: "auto", maxWidth: 800, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>

              {
                thead.map((elemento, i) =>
                  <TableCell
                    key={i}
                    align={"left"}
                    style={{ minWidth: 80, fontWeight: 'bold' }}
                  >
                    {elemento}
                  </TableCell>
                )
              }
              <TableCell
                align={"center"}
                style={{ minWidth: 80, fontWeight: 'bold' }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {              
              dataTabla?.data.length>0&&dataTabla?.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((fila, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={fila.id_solicitud}>
                      {dataTabla.indice.map((index, p) => {
                        return (
                          <TableCell key={fila[index]+parseInt(Math.random()*1000)} align={"left"} style={{ minWidth: 5 }}>
                            {fila[index]}
                          </TableCell>
                        );
                      })}

                      <TableCell align={"center"} className={style.acciones} style={{ minWidth: 80 }}>
                        <Button variant="contained" onClick={(e) => {
                          console.log(fila['id_solicitud']);
                          postularColaborador(fila['id_solicitud']);
                        }}
                          style={{ background: "green", borderRadius: "8px", textTransform: "none" }}>
                          Postular
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={dataTabla?.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
