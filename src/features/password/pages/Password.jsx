import React from 'react';
import Card from '../../../components/Card/Card.jsx'

export default function Password() {

    /**
     * ¿Tiene que trarer todas las contraseñas?
     * - Modificar las tarjetas par que queden más presentables.
     * - Cada elemento 'Card' tiene que poder ser seleccionado.
     * - Las tarjetas deben poder selecionarse y editarse individualmente.
     * - Las contraseñas, como entidad, tienen que poder ser:
     *      - Editadas (individualmente)
     *      - Eliminadas (individualmente o varias en una sola consulta)
     * - Las consultas deben ser hechas a partir del 'id' o el 'usuario_id' (propiedades de la tabla en SB).
     * - Agrupoar la lógica de negocio en el servicio. 
    */
    return (
        <Card titulo="Gmail" />
    );
}