var dataUser = __configPedimap.dataUser;
var typeUser = __configPedimap.typeUser;

var configMap = {maxZoomBound: 17};

var configInterval = {defaultTimeout: 60000};

var configMarkerIcon = {
    'vendedor': {
        url: '/pedimap/assets/markers/employer-marker.png',
        labelOrigin: new google.maps.Point(25, 10)
    },
    'cliente': {}
};

var dataVendedor = {
    'markers': [],
    'polylines': [],
    'bounds': new google.maps.LatLngBounds()
};

var dataRuta = {
    'polygons': []
};


var infoBubbles = {
    'forMarker': getDefaultInfoBubble({map: __map, disableAutoPan: false}),
    'forPolyline': getDefaultInfoBubble({map: __map, disableAutoPan: true}),
    'forPolygon': getDefaultInfoBubble({map: __map, disableAutoPan: true}),
}


var dataInput = {
    'selectSucursal': $('#sucursal'),
    'selectEsquema': $('#esquema'),
    'selectJefe': $('#jefe'),
    'selectSupervisor':$('#supervisor'),
    'selectVendedor': $('#vendedor'),
    'selectCanal': $('#canal'),
    'selectNegocio': $('#negocio'),
    'selectVisita': $('#visita'),
    'checkShowRuta': $('#showRuta'),
    'checkShowCliente': $('#showCliente')
};


/*     */
/*
var sucursal = __configPedimap.dataUser.sucursal;
var esquema = __configPedimap.dataUser.esquema;
var jefe = __configPedimap.dataUser.jefe;
var supervisor = __configPedimap.dataUser.supervisor;*/
/*

var isAdmin = (_isAdmin === 'true');
var isJefe = (_isJefe === 'true');
*/
/*
var intervalTimeout = 60000;
var maxZoomBound = 17;
*/
/*
var inputs = {
    sucursal: $('#sucursal'),
    esquema: $('#esquema'),
    jefe: $('#jefe'),
    supervisor: $('#supervisor'),
    vendedor: $('#vendedor'),
    canal: $('#canal'),
    negocio: $('#negocio'),
    visita: $('#visita'),
    showRuta: $('#showRuta')
};
*/
/*
var vendedor_markers = [];
var vendedor_polylines = [];
var vendedor_positions = new google.maps.LatLngBounds();
*/
/*
var ruta_polygons = [];

var infoBubbleMarker = getDefaultInfoBubble({map: __map, disableAutoPan: false});
var infoBubblePolyline = getDefaultInfoBubble({map: __map, disableAutoPan: true});
var infoBubblePolygon = getDefaultInfoBubble({map: __map, disableAutoPan: true});

;*/


google.maps.event.addListener(__map, "click", function (e) {
    closeInfoBubble();
});

clickCloseInfoBubble(infoBubbles.forMarker, 'forMarker');
clickCloseInfoBubble(infoBubbles.forPolyline, 'forPolyline');
clickCloseInfoBubble(infoBubbles.forPolygon, 'forPolygon');

/* Cargar elementos select y option */

window.postRequest($, {
    url: '/cliente/listar/tipo-canal',
    success: function (response) {
        document.setSelectData(inputs['canal'], response.data, {first: true});
    }
});

window.postRequest($, {
    url: '/cliente/listar/tipo-negocio',
    success: function (response) {
        document.setSelectData(inputs['negocio'], response.data, {first: true});
    }
});

window.postRequest($, {
    url: '/cliente/listar/tipo-visita',
    success: function (response) {
        document.setSelectData(inputs['visita'], response.data, {first: true});
    }
});


var customeRequests = {
    'listSimple': function (options) {
        window.postRequest($, {
            url: options.url,
            data: options.payload || {},
            success: function (response) {
                document.setSelectData(options.input, response.data || [], options.options || {});
            }
        });
    },
    'listSucursal': function () {
        window.postRequest($, {
            url: '/empresa/listar/sucursal',
            success: function (response) {
                customeRequests.listEsquema({
                    sucursal: document.setSelectData(dataInput.selectSucursal, response.data, {selected: dataUser.sucursal})
                });
            }
        });
    },
    'listEsquema': function () {

    }
};


function showVendedorPositions(options, callback) {
    window.postRequest($, {
        url: '/empleado/seguimiento/vendedor-posicion',
        data: {
            sucursal: options.sucursal || sucursal,
            esquema: options.esquema || esquema,
            jefe: options.jefe || jefe,
            supervisor: options.supervisor || supervisor,
            vendedor: options.vendedor || null
        },
        success: function (response) {
            saveVendedorMarkers(response.data);
            if (callback instanceof Function) callback();
        }
    });
}

function showVendedorRoad(options) {

    deleteVendedorPolylines();

    if (!options.vendedor) {
        return;
    }

    var options_ = {
        sucursal: options.sucursal || sucursal,
        esquema: options.esquema || esquema,
        vendedor: options.vendedor
    };

    window.postRequest($, {
        url: '/empleado/seguimiento/vendedor-recorrido',
        data: options_,
        success: function (response) {
            saveVendedorPolylines(response.data);
        }
    });

}

function showRutaPoligons(options) {
    window.postRequest($, {
        url: '/ruta/seguimiento/preventa',
        data: {
            sucursal: options.sucursal || sucursal,
            esquema: options.esquema || esquema,
            jefe: options.jefe || jefe,
            supervisor: options.supervisor || supervisor,
            vendedor: options.vendedor || null
        },
        success: function (response) {
            saveRutaPolygons(response.data)
        }
    });
}

function requestClienteLocations(options) {
    window.postRequest($, {
        url: '/cliente/seguimiento/preventa',
        data: {
            sucursal: options.sucursal || sucursal,
            esquema: options.esquema || esquema,
            jefe: options.jefe || jefe,
            supervisor: options.supervisor || supervisor,
            vendedor: options.vendedor || null
        },
        success: function (response) {
            //saveRutaPolygons(response.data)
        }
    });
}

function showVendedorList(options) {
    var options_ = {
        sucursal: options.sucursal || sucursal,
        esquema: options.esquema || esquema,
        jefe: options.jefe || jefe,
        supervisor: options.supervisor || supervisor
    };

    window.postRequest($, {
        url: '/empleado/listar/vendedor',
        data: options_,
        success: function (response) {
            document.setSelectData(inputs['vendedor'], response.data, {name: 'nombre', first: true});
        }
    });

    setFirstAndInterval(function () {
        showVendedorPositions(options_, centerVendedorInMap);
    }, function () {
        showVendedorPositions(options_);
    }, intervalTimeout);
}

function showSupervisorList(options) {
    var options_ = {
        sucursal: options.sucursal || sucursal,
        esquema: options.esquema || esquema,
        jefe: options.jefe || jefe
    };

    window.postRequest($, {
        url: '/empleado/listar/supervisor',
        data: options_,
        success: function (response) {
            options_.supervisor = document.setSelectData(inputs['supervisor'], response.data, {
                name: 'nombre',
                first: true
            });
            showVendedorList(options_);
        }
    });
    showRutaPoligons(options_);
    requestClienteLocations(options_);
}

function showJefeList(options) {
    var sucursal_ = options.sucursal || sucursal;
    var esquema_ = options.esquema || esquema;

    window.postRequest($, {
        url: '/empleado/listar/jefe',
        data: {
            sucursal: options.sucursal || sucursal,
            esquema: options.esquema || esquema
        },
        success: function (response) {
            options.jefe = document.setSelectData(inputs['jefe'], response.data, {name: 'nombre'})
            /*var options = {
                sucursal: sucursal_,
                esquema: esquema_,
                jefe: document.setSelectData(inputs['jefe'], response.data, {name: 'nombre'})
            };*/
            showSupervisorList(options);
        }
    });
}

function showEsquemaList(options) {
    window.postRequest($, {
        url: '/empresa/listar/esquema',
        data: {
            sucursal: options.sucursal || sucursal
        },
        success: function (response) {
            options.esquema = document.setSelectData(inputs['esquema'], response.data, {selected: esquema});
            showJefeList(options);
        }
    });
}

function showSucursalList() {
    window.postRequest($, {
        url: '/empresa/listar/sucursal',
        success: function (response) {
            showEsquemaList({
                sucursal: document.setSelectData(inputs['sucursal'], response.data, {selected: sucursal})
            });
        }
    });
}

if (typeUser === 'ADMIN') {
    showSucursalList();
} else if (typeUser === 'JEFEVENTAS') {
    showSupervisorList({
        sucursal: sucursal,
        esquema: esquema,
        jefe: jefe
    });
} else {
    var options_ = {
        sucursal: sucursal,
        esquema: esquema,
        jefe: jefe,
        supervisor: supervisor
    };
    showVendedorList(options_);
    showRutaPoligons({sucursal: sucursal, esquema: esquema, jefe: jefe});
    requestClienteLocations(options_);
}


inputs['sucursal'].on('change', function () {
    resetMap();
    showEsquemaList({
        sucursal: this.value
    });
})

inputs['esquema'].on('change', function () {
    resetMap();
    showJefeList({
        sucursal: inputs['sucursal'].val(),
        esquema: this.value
    });
});

inputs['jefe'].on('change', function () {
    resetMap();
    showSupervisorList({
        sucursal: inputs['sucursal'].val(),
        esquema: inputs['esquema'].val(),
        jefe: this.value
    });
});

inputs['supervisor'].on('change', function () {
    showVendedorList({
        sucursal: inputs['sucursal'].val(),
        esquema: inputs['esquema'].val(),
        jefe: inputs['jefe'].val(),
        supervisor: this.value
    });
});


inputs['vendedor'].on('change', function () {
    var vendedor_ = this.value;
    var sucursal_ = inputs['sucursal'].val();
    var esquema_ = inputs['esquema'].val();
    var options_ = {
        sucursal: sucursal_,
        esquema: esquema_,
        jefe: inputs['jefe'].val(),
        supervisor: inputs['supervisor'].val(),
        vendedor: vendedor_
    };
    var optionsRoad_ = {
        sucursal: sucursal_,
        esquema: esquema_,
        vendedor: vendedor_
    };
    setFirstAndInterval(function () {
        showVendedorPositions(options_, centerVendedorInMap);
        showVendedorRoad(optionsRoad_);
    }, function () {
        showVendedorPositions(options_);
        showVendedorRoad(optionsRoad_);
    }, intervalTimeout);
});

inputs['showRuta'].on('change', function () {
    if (this.checked) {
        showRutaPolygons();
    } else {
        closeInfoBubble();
        clearRutaPolygons();
    }
});

/*     */


function getDefaultInfoBubbleContent(options) {
    var data = options.data;
    var content = '<div id="' + options.id + '" class="infowindow">'
        + '<div class="infobody content">'
        + '<table class="table table-striped"><tbody>'
        + '<tr><th colspan="2">' + options.title + '</th></tr>';
    for (var i = 0; i < data.length; i++) {
        content += '<tr><td>' + data[i].label + '</td> <td>' + data[i].value + '</td></tr>';
    }
    content += '</tbody></table></div></div>';
    return content;
}


function contentVendedorMarker(data) {
    return getDefaultInfoBubbleContent({
        id: 'infoBubbleMarker',
        title: data.codigo + ' - ' + data.nombre,
        data: [
            {label: 'Sucursal', value: data['sucursal'].descrip},
            {label: 'Esquema', value: data['esquema'].descrip},
            {label: 'Supervisor', value: data['supervisor'].nombre},
            {label: 'Bateria', value: data.bateria},
            {label: 'Fecha y Hora', value: data.fecha}
        ]
    });
}

function contentVendedorPolyline(firstPoint, lastPoint) {
    return getDefaultInfoBubbleContent({
        id: 'infoBubblePolyline',
        title: 'RECORRIDO - VENDEDOR ' + firstPoint.codigo,
        data: [
            {label: 'Bateria', value: firstPoint.bateria + ' - ' + lastPoint.bateria},
            {label: 'Fecha y Hora', value: firstPoint.fecha + ' - ' + lastPoint.fecha}
        ]
    });
}

function contentRutaPolygon(data) {
    return getDefaultInfoBubbleContent({
        id: 'infoBubblePolygon',
        title: data.descrip,
        data: [
            {label: 'Sucursal', value: data['sucursal'].descrip},
            {label: 'Esquema', value: data['esquema'].descrip},
            {label: 'Supervisor', value: data['supervisor'].nombre},
            {label: 'Vendedor', value: data['vendedor'].codigo + ' - ' + data['vendedor'].nombre}
        ]
    });
}

function saveVendedorMarkers(data) {
    deleteVendedorMarkers();
    for (var i = 0; i < data.length; i++) {
        var vendedor = data[i];
        var marker = getDefaultMarker({
            icon: configMarkerIcon.vendedor,
            label: vendedor.codigo.toString(),
            zIndex: i + 1,
            position: vendedor.position,
            data: {
                sucursal: vendedor.sucursal.codigo,
                esquema: vendedor.esquema.codigo,
                supervisor: vendedor.sucursal.codigo
            }
        });
        var content = contentVendedorMarker(vendedor);
        setInfoBubbleInMarker(infoBubbleMarker, marker, content);
        vendedor_markers.push(marker);
        vendedor_positions.extend(vendedor.position);
        marker.setMap(__map);
    }
}

function saveRutaPolygons(data) {
    for (var i = 0; i < data.length; i++) {
        var ruta = data[i];
        var polygon = getDefaultPolygon({
            paths: window.parsePolygonPoints(ruta.coords),
            data: {
                sucursal: ruta.sucursal.codigo,
                esquema: ruta.esquema.codigo,
                supervisor: ruta.supervisor.codigo,
                vendedor: ruta.vendedor.codigo,
                codigo: ruta.codigo
            }
        });
        var content = contentRutaPolygon(ruta);
        setInfoBubbleInMap(infoBubblePolygon, polygon, content);
        ruta_polygons.push(polygon);
    }
}


function saveVendedorPolylines(data) {
    for (var i = 0; i < data.length - 1; i++) {
        var first = data[i];
        var last = data[i + 1];
        var options = getDefaultPolylineOptions([first.position, last.position]);
        var polyline = new google.maps.Polyline(options);
        /*var center = new google.maps.LatLng({
            lat: (startPoint.position.lat + endPoint.position.lat) / 2,
            lng: (startPoint.position.lng + endPoint.position.lng) / 2
        });*/
        var content = contentVendedorPolyline(first, last);
        setInfoBubbleInMap(infoBubblePolyline, polyline, content);
        vendedor_polylines.push(polyline);
        polyline.setMap(__map);
    }
}

function centerVendedorInMap() {
    closeInfoBubble();
    if (!vendedor_positions.isEmpty()) {
        google.maps.event.addListenerOnce(__map, 'bounds_changed', function (event) {
            if (this.getZoom() > maxZoomBound) {
                this.setZoom(maxZoomBound);
            }
        });
        __map.fitBounds(vendedor_positions);
    }
}

function setInfoBubbleInMarker(infoBubble, marker, content) {
    marker.addListener('click', function () {
        closeInfoBubble();
        infoBubble.setContent(content)
        infoBubble.open(__map, marker);
    });
}

function setInfoBubbleInMap(infoBubble, element, content, center) {
    google.maps.event.addListener(element, 'click', function (e) {
        closeInfoBubble();
        infoBubble.setContent(content);
        infoBubble.setPosition(center || e.latLng);
        infoBubble.open();
    });
}

function closeInfoBubble() {
    infoBubbleMarker.close();
    infoBubblePolyline.close();
    infoBubblePolygon.close();
}


function clearVendedorInMap() {
    var size = vendedor_markers.length
    if (size) {
        for (var i = 0; i < size; i++) {
            vendedor_markers[i].setMap(null);
        }
    }
}

function clearVendedorPolylines() {
    var size = vendedor_polylines.length
    if (size) {
        for (var i = 0; i < size; i++) {
            vendedor_polylines[i].setMap(null);
        }
    }
}

function clearRutaPolygons() {
    var size = ruta_polygons.length
    if (size) {
        for (var i = 0; i < size; i++) {
            ruta_polygons[i].setMap(null);
        }
    }
}

function deleteVendedorPolylines() {
    clearVendedorPolylines();
    vendedor_polylines = [];
}

function deleteVendedorMarkers() {
    clearVendedorInMap();
    vendedor_positions = new google.maps.LatLngBounds();
    vendedor_markers = [];
}

function deleteRutaPolygons() {
    clearRutaPolygons();
    ruta_polygons = [];
}

function resetMap() {
    deleteVendedorMarkers();
    deleteVendedorPolylines();
}


function showRutaPolygons() {
    var size = ruta_polygons.length;

    if (size) {
        for (var i = 0; i < size; i++) {
            ruta_polygons[i].setMap(__map);
        }
    }

}

function clickCloseInfoBubble(infowindow, element) {
    google.maps.event.addListener(infowindow, 'domready', function () {
        google.maps.event.addDomListener(document.getElementById(element), 'click', function () {
                closeInfoBubble();
            }
        );
    });
}

function getDefaultInfoBubble(options) {
    return new InfoBubble({
        map: options.map,
        shadowStyle: 0,
        padding: 0,
        backgroundColor: options.backgroundColor || '#ecf0f5',
        borderRadius: options.borderRadius || 8,
        arrowSize: options.arrowSize || 10,
        borderWidth: options.borderWidth || 1,
        borderColor: options.borderColor || '#364e93',
        hideCloseButton: true,
        disableAutoPan: options.disableAutoPan || false,
        arrowPosition: options.arrowPosition || 50,
        arrowStyle: options.arrowStyle || 0
    });
}

function getDefaultPolygonOptions(coords, data) {
    return {
        data: data || {},
        paths: coords,
        strokeColor: '#7c7e82',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0,
        zIndex: 0
    };
}

function getDefaultPolylineOptions(coords) {
    return {
        path: coords,
        strokeWeight: 4,
        strokeColor: '#4169E1',
        zIndex: 1,
        icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
        }]
    };
}

function getDefaultPolylineOptions2(options) {
    return  new google.maps.Polyline({
        path: options.path,
        strokeWeight: options.strokeWeight || 4,
        strokeColor: options.strokeColor || '#4169E1',
        zIndex: (options.zIndex || 0) + 1,
        icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
        }]
    });
}

function getDefaultPolygon(options) {
    return new google.maps.Polygon({
        data: options.data || {},
        paths: options.paths,
        strokeColor: options.strokeColor || '#7c7e82',
        strokeOpacity: options.strokeOpacity || 0.8,
        strokeWeight: options.strokeWeight || 2,
        fillOpacity: options.fillOpacity || 0,
        zIndex: (options.zIndex || 0) + 0
    });
}

function getDefaultMarker(options) {
    return new google.maps.Marker({
        data: options.data || {},
        position: options.position,
        zIndex: (options.zIndex || 0) + 3,
        icon: options.icon || '',
        label: options.label ? {text: options.label, fontSize: '11px'} : ''
    });
}