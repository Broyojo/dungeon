define(['lib/three', 'constants', 'party', 'direction'], function(THREE, Const, Party, Direction) {
    function Dungeon() {
        this.map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 1, 1, 1, 0, 1, 2, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        this.spawn_loc = {x: 3, y: 9};
        this.spawn_dir = Direction.NORTH;
    }

    Dungeon.prototype = {
        partyCollidesWith: function(x, y) {
            if (y >= 0 && y < this.map.length) {
                var row = this.map[y];
                if (x >= 0 && x < row.length) {
                    return Const.TILES[row[x]].isSolid;
                }
            }
            return false;
        },

        spawnParty: function() {
            var self = this;
            return new Party(this.spawn_loc.x,
                             this.spawn_loc.y,
                             this.spawn_dir,
                             function(x, y) {
                                 return self.partyCollidesWith(x, y);
                             });
        },

        addMeshesToScene: function(scene) {
            var material = new THREE.MeshPhongMaterial({map: texture});
            var texture = THREE.ImageUtils.loadTexture('');
            var basicWallGeom = new THREE.BoxGeometry(1, 1, 1);
            var basicTileGeom = new THREE.PlaneGeometry(1, 1, 1);
            for (var y = 0; y < this.map.length; y++) {
                var row = this.map[y];
                for (var x = 0; x < row.length; x++) {
                    var type = row[x];

                    if (type == 0) {
                        var mesh = new THREE.Mesh(basicWallGeom, material);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;

                        mesh.position.x = x;
                        mesh.position.y = 0.5;
                        mesh.position.z = y;
                        scene.add(mesh);
                    } else if (type == 1 || type == 2) {
                        var floorMesh = new THREE.Mesh(basicTileGeom, material);
                        floorMesh.castShadow = true;
                        floorMesh.receiveShadow = true;

                        floorMesh.position.x = x;
                        floorMesh.position.y = 0;
                        floorMesh.position.z = y;
                        floorMesh.rotation.x = Math.PI*-0.5;
                        scene.add(floorMesh);

                        var ceilMesh = new THREE.Mesh(basicTileGeom, material);
                        ceilMesh.castShadow = true;
                        ceilMesh.receiveShadow = true;

                        ceilMesh.position.x = x;
                        ceilMesh.position.y = 1;
                        ceilMesh.position.z = y;
                        ceilMesh.rotation.x = Math.PI*0.5;
                        scene.add(ceilMesh);
                    }
                }
            }
        }
    };

    return Dungeon;
});
