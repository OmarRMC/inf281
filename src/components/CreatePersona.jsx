import React, { useEffect, useRef } from 'react'
import style from '../styles/components/CreatePersona.module.css';
import { AlertaOkRegistro, AlertaErrorRegistro } from './sweetAlert.js';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { PersonaRegister } from './PersonaRegister';
import 'animate.css';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import PersonaDonanteRegister from './PersonaDonanteRegister';
import PersonaVoluntarioRegister from './PersonaVoluntarioRegister';
import axios from 'axios';
import Button from '@mui/material/Button';
import { PersonaReceptora } from './PersonaReceptora.jsx';

export const CreatePersona = () => {
//    const setLogged = useStore((state)=>state.setLogged) 
 //   const logged = useStore((state)=>state.logged) 
     const form_ref2= useRef(); 
    const [selectP, setselectP] = useState('');
    const [Loading, setLoading] = useState(false);
    const handleChange = (event) => {
        setselectP(event.target.value);
    };
    const { register, handleSubmit,formState: { errors },setValue } = useForm()
    const onSubmit = (data) => {
        data.ci = parseInt(data.ci);
        data.nro_cel = parseInt(data.nro_cel);
        console.log(data);
        setLoading(true);
        
        axios.post('https://proyecto-281-production.up.railway.app/api/auth/new',data)
        .then(response => {
            console.log(response);
            AlertaOkRegistro();
        }).then((res)=>{
            form_ref2.current.reset();  
        })
        .catch(error => {
            AlertaErrorRegistro(error.response.data.msg);
        })
        .finally(()=>{
            setLoading(false);
        }) 
      }
  return (
    <div  className={"animate__animated animate__backInLeft "+style.containerMain}>
        <h1>Tipo de persona :</h1>
        <form ref={form_ref2} className={style.containerF} onSubmit={handleSubmit(onSubmit)}>
            <FormControl className={style.containerSelect}>
            <FormHelperText>Seleccione un las las opciones</FormHelperText>
                <Select
                    displayEmpty
                    value={selectP}
                    {...register("tipo")}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                    <MenuItem value={"voluntario"}>Voluntario</MenuItem>
                    <MenuItem value={"donante"}>Donante</MenuItem>
                    <MenuItem value={"receptorNatural"}>Receptor</MenuItem>
                </Select>
                
            </FormControl>
            <Box className={style.boxC}>
                    {selectP=="donante" ?<div><PersonaRegister register={register} /> <PersonaDonanteRegister register={register} setValue={setValue}/></div>  :''}
                    {selectP=="voluntario" ? <div><PersonaRegister register={register} /> <PersonaVoluntarioRegister register={register}/></div> :''}
                    {selectP=="receptorNatural" ? <div><PersonaRegister register={register} /> <PersonaReceptora register={register} setValue={setValue}/></div> :''}
            </Box>
            {
                Loading ? <Button className={style.btnGuardar} variant="contained" type="submit" disabled={selectP=="" || Loading}> <CircularProgress size={25}/></Button>
                :<Button className={style.btnGuardar} variant="contained" type="submit" disabled={selectP==""}>Postular</Button>
            }
            
        </form>
        
    </div>
  )
}