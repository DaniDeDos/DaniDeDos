<p>Bot activo: $(cat status.json | jq '.botActive')</p>
<p>Función de comprobación de la última actividad: ${lastActivityCheckFunctionWorking ? 'Sí' : 'No'}</p>
<p align="right"><i>ultima coneccion</i> : <b>(.*?)</b></p> 
