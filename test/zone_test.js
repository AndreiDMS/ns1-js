"use strict";

let expect = require('chai').expect,
    NS1    = require('../lib'),
    utils  = require('./utils')

utils.setup_context('NS1.Zone', function() {

  let zone_object
  utils.test_zone_before_and_after.call(this)
  .then((zone) => { zone_object = zone })

  utils.rest_resource_tests.call(this, {
    subject:        NS1.Zone,
    existing_val:   () => zone_object.zone,
    existing_obj:   () => zone_object,
    new_object_val: 'newtestdomain.test',
    new_object_obj:   {
      'zone': 'newtestdomain.test'
    },
    update_val:     665,
    update_key:     'refresh'
  })

  describe.skip('NS1.Zone.import_zonefile()', function() {
    let zonefile_path = `test/utils/sample_zonefile.db`

    it('Should be able to upload a zonefile to an existing zone', function() {
      return NS1.Zone.import_zonefile('testdomain.test', zonefile_path).then((zone) => {
        expect(typeof zone).to.eq('Object')
      })
    })
  })

  describe('NS1.Zone.networks()', function() {
    it('Should return the available DNS networks', function() {
      return NS1.Zone.networks().then((networks) => {
        expect(Array.isArray(networks)).to.eq(true)
        expect(networks[0]).to.include.keys('network_id', 'label', 'name')
      })
    })
  })

  describe('#usage', function() {
    it('Should return zone usage stats', function() {
      return NS1.Zone.find(zone_object.zone)
      .then((zone) => {
        return zone.usage()
      }).then((stats) => {
        expect(Array.isArray(stats)).to.eq(true)
        expect(typeof stats[0].records).to.eq('number')
        expect(stats[0].records).to.eq(1)
      })
    })
  })

  describe('#stats', function() {
    it('Should return record usage stats', function() {
      return NS1.Zone.find(zone_object.zone)
      .then((zone) => {
        return zone.qps()
      }).then((stats) => {
        expect(typeof stats).to.eq('object')
        expect(typeof stats.qps).to.eq('number')
        expect(stats.qps).to.eq(0)
      })
    })
  })

})
