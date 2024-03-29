/**
 * @license MIT 
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * This file handles the camera movements 
 */

import * as THREE from "three";
import config from "./config";
const OrbitControls = require('three-orbitcontrols')


class Camera {
  /**
   * creates a camera moving along a curve 
   * 
   * @param {THREE.Scene} scene the main scene
   */
  constructor (scene, renderer) {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 500);
    this.camera.position.z = 5;
    this.camera.position.x = 5;
    this.camera.position.y = 5;
    this.camera.lookAt(0, 0, 0);

    //const controls = new OrbitControls(this.camera, renderer.domElement)
    //controls.enableDamping = true
    //controls.dampingFactor = 0.1
    //controls.enableZoom = true;

    //Create a closed wavey loop
    this.curve = new THREE.CatmullRomCurve3( [
			new THREE.Vector3( -60.6, 20.0, -55.6, 0 ),
			new THREE.Vector3( -60.6, 17.7, 60.6, 0 ),
			new THREE.Vector3( -60.6, 27.0, 120.6, 0 ),
			new THREE.Vector3( 60.6, 80.2, 60.6, 0 ),
      new THREE.Vector3( 60.6, 18.5, -70.6, 0 ),
    ] );
    this.curve.curveType = 'catmullrom';
    this.curve.closed = true;

    let points = this.curve.getPoints( 50 );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
  
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    this.curveObject = new THREE.Line( geometry, material );

    scene.add(this.curveObject);
  }

  init () {

  }

  get () {
    return this.camera;
  }

  /**
   * 
   * @param {number} time absolute time since the beginning, in ms
   */
  update (time, audio) {
    let t = time%config.cameraCycle / config.cameraCycle;
    let t2 = this.curve.getPoint((time+1000) % config.cameraCycle / config.cameraCycle);
    t2.y-= 1.0;
    t2.multiplyScalar(0.2);
    let pos = this.curve.getPoint(t);
    let tan = this.curve.getTangent(t);
    this.camera.position.set(pos.x, pos.y, pos.z);
    this.camera.lookAt(t2);

    this.camera.fov = 75 + audio.peak.value * audio.peak.energy/10.0;
    this.camera.updateProjectionMatrix();
  }
};

export default Camera;