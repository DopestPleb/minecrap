function Block(x,y,z,texture) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.texture = texture
	if (this.texture) {
		this.textureLoader = new T.TextureLoader();
		this.texture = new this.textureLoader.load(`./textures/blocks/${this.texture}.png`);
		this.mesh = new T.Mesh(
	    	new T.BoxGeometry(1, 1, 1),
	    	new T.MeshLambertMaterial({
	    		color:0xffffff,
	    		map:this.texture
	    	})
	    );
	}
    this.mesh.position.set(this.x, this.y, this.z);
}