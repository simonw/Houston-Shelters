import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import MdClear from 'react-icons/lib/md/clear';

class Search extends Component {
	state = {
		query: '',
		searched: [],
		counties: [],
		cursor: 0
	}

	updateQuery = (query) => {
		this.setState({
			query: query
		})
		this.searchData(query)
	}

	searchData = (query) => {
		const {
			allMarkers,
			filteredMarkers,
			tempFilteredMarkers,
			tempSelectedFilter,
			onOpenInfoBox,
			onInputSearch,
			onOpenSearchBox,
			onCloseSearchBox } = this.props;

		const matchedAny = filteredMarkers.filter(
			data => {
				const { shelter, address, city, county, supplyNeeds, volunteerNeeds } = data;
				const concat = `${shelter} ${address} ${city} ${county} ${supplyNeeds} ${volunteerNeeds}`.toLowerCase();
				return concat.indexOf(query.toLowerCase()) > -1
			}
		)

		const matchedCounty = filteredMarkers.filter( data => {
			const { county } = data;
			return `${county}`.toLowerCase().indexOf(query.toLowerCase()) > -1
		})

		if (query.length > 1) {
			this.setState({
				searched: matchedAny,
				counties: matchedCounty
			})

			if (matchedAny.length > 0) {
				onInputSearch(matchedAny, 'All Shelters')
				onOpenSearchBox()

			} else {
				onCloseSearchBox()
			}
		} else {
			this.setState({
				searched: [],
				cursor: 0
			})
			onCloseSearchBox()
			onInputSearch(tempFilteredMarkers, tempSelectedFilter)
		}
	}

	handleInputSearch = () => {
		const { onOpenSearchBox, onCloseInfoBox, onClearCounties } = this.props;
		const { searched } = this.state;
		if (searched.length > 1) {
			onOpenSearchBox()
		}
		onCloseInfoBox()
		onClearCounties()
	}

	handleClearSearch = () => {
		const { onInputSearch, tempFilteredMarkers, tempSelectedFilter } = this.props;
        this.setState({
            query: '',
            cursor: 0
        })
        onInputSearch(tempFilteredMarkers, tempSelectedFilter)
    }

    handleClickSearch = (data) => {
		const { onCloseSearchBox, onOpenInfoBox, onHandleUpdateQuery } = this.props;

		if (data) {
			this.setState({
				query: `${ data.shelter } at ${ data.address }, ${ data.city }`,
				cursor: 0,
				counties: []
			})
		}
		const query = '';
		onHandleUpdateQuery(query)
		onCloseSearchBox()
	}

    handleKeyDown = (e, data, query) => {
	    const { cursor, searched, counties } = this.state;
	    const {
	    	onCompleteSearch,
	    	onInputSearch,
	    	onCloseSearchBox,
	    	onOpenInfoBox,
	    	onSetBounds,
	    	onClearCounties,
	    	onHandleUpdateQuery } = this.props;
	    // up

	    onClearCounties()
	    if (e.keyCode === 38) {
			if (cursor > 0) {
				this.setState( prevState => ({
					cursor: prevState.cursor - 1
				}))
			}
			if (cursor <= 0) {
				this.setState({
					cursor: searched.length -1
				})
			}
			// down
	    } else if (e.keyCode === 40) {
    		this.setState( prevState => ({
				cursor: prevState.cursor + 1
			}))

			if (cursor >= searched.length - 1) {
				this.setState({
					cursor: 0
				})
			}
	    }

	    // Enter
	    if (e.keyCode === 13) {
	    	if (!data){return}
	    	else if ( counties.length === searched.length) {
	    		this.setState({
		    		query: data.county
		    	})
		    	onSetBounds(counties)
		    	onHandleUpdateQuery(query)
	    		onCloseSearchBox()
	    		return
	    	}
	    	const fullLocation = `${ data.shelter } at ${ data.address }, ${ data.city }`
	    	this.setState({
	    		query: fullLocation
	    	})
	    	onHandleUpdateQuery(query)
	    	onCompleteSearch(data)
	    	onCloseSearchBox()
	    }
	}

	handleMouseOver = (index) => {
		this.setState({
			cursor: index
		})
	}

	render() {
		const { query, searched, cursor } = this.state;
		const { selectedFilter, onCompleteSearch, toggledSearchBox, toggledInfo, onOpenInfoBox, onCloseInfoBox, onClearCounties} = this.props;
	  	return (
				<div className={toggledInfo ? 'search-data-container open' : 'search-data-container'}>
					<div className="search-data-bar">
					  <div className="search-data-input-wrapper">
					    <input
						    type="text"
						    placeholder="Search by Shelter, Address, County, or Needs (e.g. baby formula)"
						    value={query}
						    onChange={(e) => this.updateQuery(e.target.value)}
						    onClick={() => this.handleInputSearch()}
						    onKeyDown={(e) => this.handleKeyDown(e, searched[cursor], query)}
					    />
					    <MdClear
						    className='clear-icon'
						    onClick={() => {
						    	this.handleClearSearch()
						    	this.handleClickSearch()
						    }}
						/>
					  </div>
					</div>
					<div className={ toggledSearchBox ? 'search-data-results' : 'search-data-results hide'}>
						<ul>
							{searched.map((data, index) => (
								<li key={index}
									className={cursor === index ? 'searchSelected' : ''}
									onMouseOver={() => {this.handleMouseOver(index)}}
									onClick={() => {
										this.handleClickSearch(data)
										onCompleteSearch(data)
									}}>
									{`${ data.shelter } at ${ data.address }, ${ data.city }`}
								</li>
							))}
						</ul>
					</div>
					{this.props.children}
				</div>
			)
		}
}

export default Search