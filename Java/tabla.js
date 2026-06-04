fetch('precios.txt')
    .then(response => response.text())
    .then(data => {
        let filas = data.trim().split('\n').filter(fila => fila.trim() !== '');
        let tbody = document.querySelector('#tabla-precios tbody');
        filas.forEach(fila => {
            let columnas = fila.split(',');
            let tr = document.createElement('tr');
            columnas.forEach(columna => {
                let td = document.createElement('td');
                td.textContent = columna.trim();
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error al cargar el archivo:', error));